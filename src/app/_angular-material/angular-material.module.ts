import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, DragDropModule,
    MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatTabsModule,
    MatCardModule, MatTableModule, MatDividerModule, MatRippleModule, MatCheckboxModule, MatMenuModule,
    MatTooltipModule, MatDialogModule, MatSelectModule, MatDatepickerModule, MatSlideToggleModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatSnackBarModule, MatNativeDateModule,
    MatChipsModule, MatBadgeModule, MatRadioModule, MatGridListModule, MatPaginatorModule, MatSortModule,
    MatAutocompleteModule, MatProgressBarModule, MatExpansionModule
  ],
  exports: [
    DragDropModule,
    MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatTabsModule,
    MatCardModule, MatTableModule, MatDividerModule, MatRippleModule, MatCheckboxModule, MatMenuModule,
    MatTooltipModule, MatDialogModule, MatSelectModule, MatDatepickerModule, MatSlideToggleModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatSnackBarModule, MatNativeDateModule,
    MatChipsModule, MatBadgeModule, MatRadioModule, MatGridListModule, MatPaginatorModule, MatSortModule,
    MatAutocompleteModule, MatProgressBarModule, MatExpansionModule
  ]
})
export class AngularMaterialModule {}
