import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { YearService } from '../../../_core/services/year.service';
import { Year } from '../../../_shared/models/year';

@Component({
  selector: 'isag-add-year-dialog',
  templateUrl: './add-year-dialog.component.html',
  styleUrls: ['./add-year-dialog.component.scss']
})
export class AddYearDialogComponent implements OnInit {
  spinner = false;
  year: Year;

  constructor(public dialogRef: MatDialogRef<AddYearDialogComponent>,
              public yearService: YearService) { }

  ngOnInit(): void {
   this.year = new Year(this.yearService.nextAvailableYear);
  }

  addYear(): void {
    this.spinner = true;
    this.yearService.create(this.year).subscribe({
      next: newYear => this.dialogRef.close(newYear),
      error: () => this.spinner = false
    });
  }

  setDate(): void {
    const date = new Date(`4/1/${this.year.year}`);
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1);
    }
    this.year.date = date;
  }

}
