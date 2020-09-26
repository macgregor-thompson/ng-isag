import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialogData } from '../../models/confirm-dialog-data';

@Component({
  selector: 'isag-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  title = 'Are you sure?';
  message = '';
  okButton = 'OK';
  okButtonClass: 'primary' | 'accent' | 'warn'  = 'warn';
  cancelButton = 'Cancel';

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) { }

  ngOnInit() {
    if (this.data.title) this.title = this.data.title;
    if (this.data.message) this.message = this.data.message;
    if (this.data.okButton) this.okButton = this.data.okButton;
    if (this.data.okButtonClass) this.okButtonClass = this.data.okButtonClass;
    if (this.data.cancelButton) this.cancelButton = this.data.cancelButton;
  }

  ngOnDestroy(): void {
    (document.activeElement as HTMLButtonElement).blur();
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
