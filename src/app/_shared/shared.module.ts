import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';

import { AngularMaterialModule } from '../_angular-material/angular-material.module';
import { AlertComponent } from './components/alert/alert.component';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { AbsoluteValuePipe } from './pipes/absolute-value.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormsModule } from '@angular/forms';
import { StopRippleDirective } from './directives/stop-ripple.directive';
import { OrderByPipe } from './pipes/order-by.pipe';
import { SortByNamePipe } from './pipes/sort-by-name.pipe';
import { PlayerMultipleSelectComponent } from './components/player-multiple-select/player-multiple-select.component';
import { SearchPlayerPipe } from './pipes/search-player.pipe';
import { FilterOutSelectedPlayersPipe } from './pipes/filter-out-selected-players.pipe';
import { FilterPlayersByYearPipe } from './pipes/filter-players-by-year.pipe';
import { LogPipe } from './pipes/log.pipe';

@NgModule({
  declarations: [
    AlertComponent,
    StopPropagationDirective,
    StopRippleDirective,
    AbsoluteValuePipe,
    ConfirmDialogComponent,
    SafeHtmlPipe,
    OrderByPipe,
    SortByNamePipe,
    PlayerMultipleSelectComponent,
    SearchPlayerPipe,
    FilterOutSelectedPlayersPipe,
    FilterPlayersByYearPipe,
    LogPipe
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    QuillModule.forRoot()

  ],
  exports: [
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    QuillModule,

    AlertComponent,
    AbsoluteValuePipe,
    ConfirmDialogComponent,
    SafeHtmlPipe,
    StopPropagationDirective,
    StopRippleDirective,
    OrderByPipe,
    SortByNamePipe,
    SearchPlayerPipe,
    PlayerMultipleSelectComponent,
    FilterOutSelectedPlayersPipe,
    FilterPlayersByYearPipe,
    LogPipe
  ],
  providers: [
    FilterPlayersByYearPipe,
    OrderByPipe
  ]
})
export class SharedModule {}
