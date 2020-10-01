import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { User } from '../../_shared/models/user';
import { CatchError } from '../decorators/catch-error';
import { Player } from '../../_shared/models/player';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersApi = 'api/users';

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService) {}

  @SpinnerAndCatchError
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApi);
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
