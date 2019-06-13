import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LinksDataSource } from '../../store/_data-sources/links.datasource';
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { Link } from '../../models';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import * as fromStore from '../../store';
import { Store } from '@ngrx/store';
import {
  LayoutUtilsService,
  QueryParamsModel,
  MessageType
} from '../../../core/_base/crud';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  skip,
  delay,
  take
} from 'rxjs/operators';
import { LinkEditComponent } from '../link-edit/link-edit.component';
import { UiHelperService } from '../../services/ui-helper.service';
import { CustomDropdownConfig } from '../../../partials/content/widgets/custom-dropdown/dropdown-config.model';

@Component({
  selector: 'kt-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.scss']
})
export class LinksListComponent implements OnInit {
  // Table fields
  dataSource: LinksDataSource;
  displayedColumns = [
    'select',
    '_createdDate',
    'url',
    'destination',
    'hits',
    'status',
    '_updatedDate',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sort1') sort: MatSort;
  // Filter fields
  @ViewChild('searchInput') searchInput: ElementRef;
  filterStatus: string = '';
  filterType: string = '';
  // Selection
  selection = new SelectionModel<Link>(true, []);
  linksResult: Link[] = [];
  // Subscriptions
  private subscriptions: Subscription[] = [];

  accountDropdownCfg: CustomDropdownConfig = {
    title: 'Account',
    items: [
      {
        label: 'ALL',
        value: 'ALL'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 2',
        value: 'Value 2'
      }
    ]
  };

  domainsDropdownCfg: CustomDropdownConfig = {
    title: 'Domains',
    items: [
      {
        label: 'drinks.me',
        value: 'drinks.me'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 2',
        value: 'Value 2'
      }
    ]
  };

  usersDropdownCfg: CustomDropdownConfig = {
    title: 'Users',
    items: [
      {
        label: 'All Users',
        value: 'ALL_USERS'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 2',
        value: 'Value 2'
      }
    ]
  };

  tagsDropdownCfg: CustomDropdownConfig = {
    title: 'Tags',
    items: [
      {
        label: 'All tags',
        value: 'ALL_TAGS'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 2',
        value: 'Value 2'
      }
    ]
  };

  /**
   * Component constructor
   *
   * @param dialog: MatDialog
   * @param snackBar: MatSnackBar
   * @param layoutUtilsService: LayoutUtilsService
   * @param translate: TranslateService
   * @param store: Store<AppState>
   */
  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private store: Store<fromStore.LinksFeatureState>,
    private uiHelper: UiHelperService
  ) {}

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );
    this.subscriptions.push(sortSubscription);

    const createLinkBtnSuscription = this.uiHelper.createLinkBtnClicks$.subscribe(
      () => this.addLink()
    );
    this.subscriptions.push(createLinkBtnSuscription);

    /* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
    const paginatorSubscriptions = merge(
      this.sort.sortChange,
      this.paginator.page
    )
      .pipe(tap(() => this.loadLinksList()))
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    // Init DataSource
    this.dataSource = new LinksDataSource(this.store);
    const entitiesSubscription = this.dataSource.entitySubject
      .pipe(
        skip(1),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.linksResult = res;
      });
    this.subscriptions.push(entitiesSubscription);
    // First load
    of(undefined)
      .pipe(
        take(1),
        delay(1000)
      )
      .subscribe(() => {
        // Remove this line, just loading imitation
        this.loadLinksList();
      }); // Remove this line, just loading imitation
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Links List from service through data-source
   */
  loadLinksList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      {},
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(
      new fromStore.LinksPageRequested({ page: queryParams })
    );
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.status = +this.filterStatus;
    }

    if (this.filterType && this.filterType.length > 0) {
      filter.type = +this.filterType;
    }

    filter.lastName = searchText;
    if (!searchText) {
      return filter;
    }

    filter.firstName = searchText;
    filter.email = searchText;
    filter.ipAddress = searchText;
    return filter;
  }

  /** ACTIONS */
  /**
   * Delete link
   *
   * @param _item: Link
   */
  deleteLink(_item: Link) {
    const _title: string = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.TITLE'
    );
    const _description: string = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.DESCRIPTION'
    );
    const _waitDescription: string = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.WAIT_DESCRIPTION'
    );
    const _deleteMessage = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_SIMPLE.MESSAGE'
    );

    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDescription
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new fromStore.OneLinkDeleted({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(
        _deleteMessage,
        MessageType.Delete
      );
    });
  }

  /**
   * Delete selected links
   */
  deleteLinks() {
    const _title: string = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.TITLE'
    );
    const _description: string = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.DESCRIPTION'
    );
    const _waitDesciption: string = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.WAIT_DESCRIPTION'
    );
    const _deleteMessage = this.translate.instant(
      'ECOMMERCE.CUSTOMERS.DELETE_CUSTOMER_MULTY.MESSAGE'
    );

    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(
        new fromStore.ManyLinksDeleted({ ids: idsForDeletion })
      );
      this.layoutUtilsService.showActionNotification(
        _deleteMessage,
        MessageType.Delete
      );
      this.selection.clear();
    });
  }

  /**
   * Fetch selected links
   */
  fetchLinks() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: elem.url,
        id: elem.id.toString(),
        status: elem.status
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Show add link dialog
   */
  addLink() {
    const newLink = new Link();
    newLink.clear(); // Set all defaults fields
    this.editLink(newLink);
  }

  /**
   * Show Edit link dialog and save after success close result
   * @param link: Link
   */
  editLink(link: Link) {
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    saveMessageTranslateParam += link.id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = link.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(LinkEditComponent, {
      data: { link: link }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(
        _saveMessage,
        _messageType
      );
      this.loadLinksList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.linksResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle all selections
   */
  masterToggle() {
    if (this.selection.selected.length === this.linksResult.length) {
      this.selection.clear();
    } else {
      this.linksResult.forEach(row => this.selection.select(row));
    }
  }

  /** UI */
  /**
   * Retursn CSS Class Name by status
   *
   * @param status: number
   */
  getItemCssClassByStatus(status: 'active' | 'inactive'): string {
    switch (status) {
      case 'active':
        return 'warning';
      case 'inactive':
        return 'danger';
    }
    return '';
  }

  /**
   * Returns Item Status in string
   * @param status: number
   */
  getItemStatusString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Suspended';
      case 1:
        return 'Active';
      case 2:
        return 'Pending';
    }
    return '';
  }

  /**
   * Returns CSS Class Name by type
   * @param status: number
   */
  getItemCssClassByType(status: number = 0): string {
    switch (status) {
      case 0:
        return 'accent';
      case 1:
        return 'primary';
      case 2:
        return '';
    }
    return '';
  }

  /**
   * Returns Item Type in string
   * @param status: number
   */
  getItemTypeString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Business';
      case 1:
        return 'Individual';
    }
    return '';
  }
}
