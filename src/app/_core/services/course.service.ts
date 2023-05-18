import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { Course } from '../../_shared/models/course/course';
import { tap } from 'rxjs/operators';
import { AppInitializerService } from '../../app-initializer.service';
import { Player } from '../../_shared/models/player';
import { Pairing } from '../../_shared/models/pairing';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseApi = 'api/courses';
  holeHeaders = ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out',
    '10', '11', '12', '13', '14', '15', '16', '17', '18', 'In', 'Total'];

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService) {
  }

  @SpinnerAndCatchError
  getAll(year: number = this.stateService.year.year): Observable<Course[]> {
    return this.http.get<Course[]>(`${ this.courseApi }`);
  }

  @SpinnerAndCatchError
  getByYear(year: number = this.stateService.year.year): Observable<Course> {
    if (year === this.stateService.course?.year) return of(this.stateService.course);
    return this.http.get<Course>(`${ this.courseApi }/${ year }`).pipe(
      tap(course => {
        if (course.year === this.stateService.year.year) this.stateService.course = course;
      })
    );
  }

  @SpinnerAndCatchError
  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.courseApi, course);
  }

  @SpinnerAndCatchError
  update(courseId: string, update: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${ this.courseApi }/${ courseId }`, update);
  }

  @SpinnerAndCatchError
  delete(courseId: string): Observable<Course> {
    return this.http.patch<Course>(`${ this.courseApi }/${ courseId }`, { deleted: true });
  }

  setAAndBPlayersCourseHandicaps([aPlayers, bPlayers]: [Player[], Player[]]): [Player[], Player[]] {
    return [
      aPlayers.map(p => ({...p, courseHandicap: this.stateService.getCourseHandicap(p.handicap)})),
      bPlayers.map(p => ({...p, courseHandicap: this.stateService.getCourseHandicap(p.handicap)}))
    ];
  }
}
