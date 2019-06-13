import { Component, OnInit, Inject } from '@angular/core';
import { Link } from '../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as fromStore from '../../store';
import { Store, select } from '@ngrx/store';
import { TypesUtilsService } from '../../../core/_base/crud';
import { Update } from '@ngrx/entity';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'kt-link-edit',
  templateUrl: './link-edit.component.html',
  styleUrls: ['./link-edit.component.scss']
})
export class LinkEditComponent implements OnInit {
  // Public properties
  link: Link;
  linkForm: FormGroup = this.createForm();
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  // Private properties
  private componentSubscriptions: Subscription;

  /**
   * Component constructor
   *
   * @param dialogRef: MatDialogRef<LinkEditComponent>
   * @param data: any
   * @param fb: FormBuilder
   * @param store: Store<AppState>
   * @param typesUtilsService: TypesUtilsService
   */
  constructor(
    public dialogRef: MatDialogRef<LinkEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private store: Store<fromStore.LinksFeatureState>,
    private typesUtilsService: TypesUtilsService
  ) {}

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    console.log('form', this.linkForm);
    this.store
      .pipe(select(fromStore.selectLinksActionLoading))
      .subscribe(res => (this.viewLoading = res));
    this.link = this.data.link;
    this.linkForm.patchValue(this.link);
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  createForm() {
    return this.fb.group({
      url: ['', Validators.required],
      destination: ['', Validators.required],
      hits: [0]
    });
  }

  /**
   * Returns page title
   */
  getTitle(): string {
    if (this.link.id > 0) {
      return `Edit link '${this.link.id}'`;
    }

    return 'New link';
  }

  /**
   * Check control is invalid
   * @param controlName: string
   */
  isControlInvalid(controlName: string): boolean {
    const control = this.linkForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  /** ACTIONS */

  /**
   * Returns prepared link
   */
  prepareLink(): Link {
    const controls = this.linkForm.controls;
    const link = new Link();
    link.id = this.link.id;

    link.url = controls['url'].value;
    link.destination = controls['destination'].value;
    link.hits = controls['hits'].value;
    link.status = this.link.id > 0 ? this.link.status : 'active';

    link._createdDate =
      this.link.id > 0 ? this.link._createdDate : new Date().toISOString();
    link._updatedDate = new Date().toISOString();

    return link;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.linkForm.controls;
    /** check form */
    if (this.linkForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    const editedLink = this.prepareLink();
    console.log('editedLink', editedLink);
    if (editedLink.id > 0) {
      this.updateLink(editedLink);
    } else {
      this.createLink(editedLink);
    }
  }

  /**
   * Update link
   *
   * @param _link: Link
   */
  updateLink(_link: Link) {
    const updateLink: Update<Link> = {
      id: _link.id,
      changes: _link
    };
    this.store.dispatch(
      new fromStore.LinkUpdated({
        partialLink: updateLink,
        link: _link
      })
    );

    // Remove this line
    of(undefined)
      .pipe(delay(1000))
      .subscribe(() => this.dialogRef.close({ _link: _link, isEdit: true }));
    // Uncomment this line
    // this.dialogRef.close({ _link, isEdit: true }
  }

  /**
   * Create link
   *
   * @param _link: Link
   */
  createLink(_link: Link) {
    this.store.dispatch(new fromStore.LinkOnServerCreated({ link: _link }));
    this.componentSubscriptions = this.store
      .pipe(
        select(fromStore.selectLastCreatedLinkId),
        delay(1000) // Remove this line
      )
      .subscribe(res => {
        console.log('res', res);
        if (!res) {
          return;
        }

        this.dialogRef.close({ _link: _link, isEdit: false });
      });
  }

  /** Alect Close event */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
