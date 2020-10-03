import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

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

  openAddCourseDialog(): void {
    const unavailableYears = {};
    this.courses.forEach(c => { if (c.year) unavailableYears[c.year] = true; });

    const dialogRef = this.dialog.open(NewCourseDialogComponent, {
      panelClass: 'scorecard-modal',
      data: { unavailableYears }
    });

    dialogRef.afterClosed().subscribe((newCourse: Course) => {
      if (newCourse) this.courses = [...this.courses, newCourse];
    });
  }

}
