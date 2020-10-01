import { Component, OnInit } from '@angular/core';
import { Course } from '../../_shared/models/course/course';
import { CourseService } from '../../_core/services/course.service';

@Component({
  selector: 'isag-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: Course[];
  selectedCourse: Course;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getAll().subscribe(c => this.courses = c);
  }

  selectCourse(course: Course): void {
    this.selectedCourse = course;
  }

}
