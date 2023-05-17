import { Component, Inject, OnInit } from '@angular/core';

import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { every as _every, cloneDeep as _cloneDeep } from 'lodash-es';

import { Course } from '../../../_shared/models/course/course';
import { CourseService } from '../../../_core/services/course.service';
import { NineHoles } from '../../../_shared/models/course/nine-holes';
import { YearService } from '../../../_core/services/year.service';

@Component({
  selector: 'isag-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.scss']
})
export class NewCourseDialogComponent implements OnInit {
  course: Course;
  spinner = false;

  constructor(public courseService: CourseService,
              public dialogRef: MatDialogRef<NewCourseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { unavailableYears: { [year: number]: boolean }, course?: Course },
              public yearService: YearService) {
    this.course = data.course ? _cloneDeep(data.course) : new Course();
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  updateYards(): void {
    this.course.frontNineYards = this.sum(this.course.frontNine, 'yardage');
    this.course.backNineYards = this.sum(this.course.backNine, 'yardage');
  }

  updatePar(): void {
    this.course.frontNinePar = this.sum(this.course.frontNine, 'par');
    this.course.backNinePar = this.sum(this.course.backNine, 'par');
  }

  sum(nine: NineHoles, prop: 'yardage' | 'par'): number {
    return Object.values(nine)
      .reduce((a, b) => a + (b[prop] != null || !isNaN(b[prop]) ? b[prop] : 0), 0);
  }


  addCourse(): void {
    this.courseService.create(this.course).subscribe({
      next: course => this.dialogRef.close({ newCourse: course })
    });
  }

  updateCourse(): void {
    const { _id, ...course } = this.course;
    this.courseService.update(_id, course).subscribe({
      next: c => this.dialogRef.close({ updated: c })
    });
  }

  canSave(): boolean {
    return this.course.name.length
      && _every(this.course.frontNine, h => h.par != null && h.handicap != null && h.yardage != null)
      && _every(this.course.backNine, h => h.par != null && h.handicap != null && h.yardage != null);
  }

}
