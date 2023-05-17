import { Component, OnInit } from '@angular/core';

import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { merge as _merge, cloneDeep as _cloneDeep } from 'lodash-es';

import { Course } from '../../_shared/models/course/course';
import { CourseService } from '../../_core/services/course.service';
import { StateService } from '../../_core/services/state.service';
import { NewCourseDialogComponent } from './new-course-dialog/new-course-dialog.component';

@Component({
  selector: 'isag-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: Course[];
  selectedCourse: Course;

  constructor(private courseService: CourseService,
              public stateService: StateService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.courseService.getAll().subscribe(c => this.courses = c);
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
  }

  openAddCourseDialog(course?: Course): void {
    const unavailableYears = {};
    this.courses.forEach(c => { if (c.year) unavailableYears[c.year] = true; });

    const dialogRef = this.dialog.open(NewCourseDialogComponent, {
      panelClass: 'scorecard-modal',
      data: { unavailableYears, course }
    });

    dialogRef.afterClosed().subscribe(({newCourse, updated}: {newCourse: Course, updated: Course}) => {
      if (newCourse) this.courses = [...this.courses, newCourse];
      const index = this.courses.findIndex(c => c._id === updated._id);
      this.courses[index] = _merge(this.courses[index], _cloneDeep(updated));
    });
  }

}
