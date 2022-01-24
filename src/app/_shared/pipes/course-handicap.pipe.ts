import { Pipe, PipeTransform } from '@angular/core';
import { Course } from '../models/course/course';

@Pipe({
  name: 'courseHandicap'
})
export class CourseHandicapPipe implements PipeTransform {

  transform(handicap: number, course: Course): number {
    // course handicap = handicap index x (slope / 113) + (course rating - par)
    return (handicap * course.slope / 113) + (course.courseRating - course.frontNinePar - course.backNinePar);
  }

}
