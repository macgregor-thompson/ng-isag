import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { Course } from '../../_shared/models/course/course';
import { CatchError } from '../decorators/catch-error';
import { Player } from '../../_shared/models/player';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseApi = 'api/courses';
  holeHeaders = ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', 'In', 'Total'];

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService) { }

  @SpinnerAndCatchError
  getAll(year: number = this.stateService.year.year): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.courseApi}`);
  }

  @SpinnerAndCatchError
  getByYear(year: number = this.stateService.year.year): Observable<Course> {
    return this.http.get<Course>(`${this.courseApi}/${year}`);
  }

  @SpinnerAndCatchError
  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.courseApi, course);
  }

  @SpinnerAndCatchError
  update(courseId: string, update: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.courseApi}/${courseId}`, update);
  }

  @SpinnerAndCatchError
  delete(courseId: string): Observable<Course> {
    return this.http.patch<Course>(`${this.courseApi}/${courseId}`, { deleted: true } );
  }
}
