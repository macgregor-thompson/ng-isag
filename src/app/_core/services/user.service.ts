import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { SpinnerService } from './spinner.service';
import { User } from '../../_shared/models/user';
import { CatchError } from '../decorators/catch-error';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { CreateUser } from '../../_shared/models/create-user';
import { catchError, map } from 'rxjs/operators';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersApi = 'api/users';
  private validateUsernameTimeout;

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService) {}

  @SpinnerAndCatchError
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApi);
  }



  isUserNameTaken(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.usersApi}/username?username=${username}`);
  }

  @SpinnerAndCatchError
  create(user: CreateUser): Observable<User> {
    return this.http.post<User>(this.usersApi, user);
  }

  @CatchError
  update(userId: string, update: Partial<User>): Observable<void> {
    return this.http.patch<void>(`${this.usersApi}/${userId}`, update);
  }

  @CatchError
  delete(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.usersApi}/${userId}`, { deleted: true } );
  }


}
