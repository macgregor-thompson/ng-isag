import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '../_angular-material/angular-material.module';
import { AlertComponent } from './components/alert/alert.component';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AbsoluteValuePipe } from './pipes/absolute-value.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    AlertComponent,
    StopPropagationDirective,
    AbsoluteValuePipe,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule

  ],
  exports: [
    AngularMaterialModule,
    FlexLayoutModule,

    AlertComponent,
    AbsoluteValuePipe,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
