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

@NgModule({
  declarations: [
    AlertComponent,
    StopPropagationDirective,
    AbsoluteValuePipe,
    ConfirmDialogComponent,
    SafeHtmlPipe
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
  ]
})
export class SharedModule { }
