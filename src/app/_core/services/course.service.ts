import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { Course } from '../../_shared/models/course/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseApi = 'api/courses';

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService) { }

  @SpinnerAndCatchError
  getAll(year: number = this.stateService.year.year): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.courseApi}`);
  }

  @SpinnerAndCatchError
  getByYear(year: number = this.stateService.year.year): Observable<Course> {
    return this.http.get<Course>(`${this.courseApi}?year=${year}`);
  }
}
