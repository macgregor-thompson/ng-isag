import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
