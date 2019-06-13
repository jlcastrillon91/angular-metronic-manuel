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
    private store: Store<fromStore.LinksFeatureState>
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

    // Filtration, bind to searchInput
    const searchSubscription = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        // tslint:disable-next-line:max-line-length
        debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
        distinctUntilChanged(), // This operator will eliminate duplicate values
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadLinksList();
        })
      )
      .subscribe();
    this.subscriptions.push(searchSubscription);

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
      this.filterConfiguration(),
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

  // /**
  //  * Show UpdateStatuDialog for selected customers
  //  */
  // updateStatusForCustomers() {
  // 	const _title = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.TITLE');
  // 	const _updateMessage = this.translate.instant('ECOMMERCE.CUSTOMERS.UPDATE_STATUS.MESSAGE');
  // 	const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
  // 	const _messages = [];

  // 	this.selection.selected.forEach(elem => {
  // 		_messages.push({
  // 			text: elem.url,
  // 			id: elem.id.toString(),
  // 			status: elem.status,
  // 			statusCssClass: this.getItemCssClassByStatus(elem.status)
  // 		});
  // 	});

  // 	const dialogRef = this.layoutUtilsService.updateStatusForEntities(_title, _statuses, _messages);
  // 	dialogRef.afterClosed().subscribe(res => {
  // 		if (!res) {
  // 			this.selection.clear();
  // 			return;
  // 		}

  // 		this.store.dispatch(new fromStore.LinksStatusUpdated({
  // 			status: +res,
  // 			customers: this.selection.selected
  // 		}));

  // 		this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update, 10000, true, true);
  // 		this.selection.clear();
  // 	});
  // }

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
        return 'success';
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
