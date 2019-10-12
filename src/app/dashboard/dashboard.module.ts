import { MatLinkPreviewModule } from '@angular-material-extensions/link-preview';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../core/core.module';
import { PartialsModule } from '../partials/partials.module';

// containers
import * as fromContainers from './containers';

// store
import { reducers, effects } from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LinkDetailsComponent } from './containers/link-details/link-details.component';

const MAT_MODULES = [
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatSnackBarModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PartialsModule,
    CoreModule,
    NgbModule,
    ...MAT_MODULES,
    MatLinkPreviewModule,

    RouterModule.forChild([
      {
        path: '',
        component: fromContainers.DashboardComponent
      },
      { path: 'details/:id', component: LinkDetailsComponent },
    ]),

    // Store
    StoreModule.forFeature('linksFeatureState', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    }
  ],
  declarations: [...fromContainers.containers, LinkDetailsComponent],
  entryComponents: [fromContainers.LinkEditComponent]
})
export class DashboardModule {}
