import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Golfer } from '../../_shared/models/golfer';

@Injectable({
  providedIn: 'root'
})
export class GolferService {

  golfersApi = 'api/golfers';

  constructor(private http: HttpClient) {}

  getAllGolfers(): Observable<Golfer[]> {
    return this.http.get<Golfer[]>(this.golfersApi);
  }
}
