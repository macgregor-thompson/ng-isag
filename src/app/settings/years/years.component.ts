import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { merge as _merge } from 'lodash';

import { YearService } from '../../_core/services/year.service';
import { Year } from '../../_shared/models/year';
import { StateService } from '../../_core/services/state.service';
import { AddYearDialogComponent } from './add-year-dialog/add-year-dialog.component';


@Component({
  selector: 'isag-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {
  selectedYear: Year;

  constructor(public yearService: YearService,
              public stateService: StateService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {

  }

  selectYear(year: Year): void {
    this.selectedYear = year;
  }

  openAddYearDialog() {
    const dialogRef = this.dialog.open(AddYearDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((newYear: Year) => {
      if (newYear) this.yearService.years = [...(this.yearService.years || []), newYear ];
    });
  }

  updateIsPublic(year: Year): void {
    this.yearService.update(year._id, { public: year.public}).subscribe();
  }

  setCurrent(year: Year): void {
    const currentYear = this.yearService.years.find(y => y.current);
    currentYear.current = false;
    year.current = true;
    this.yearService.setCurrent(year._id).subscribe();
  }

  closeYearDetails() {
    this.selectedYear = null;
    this.router.navigate([]);
  }

  onUpdate(year: {_id: string, update: Partial<Year>}): void {
    this.selectedYear = _merge(this.selectedYear, year.update);
  }
}
