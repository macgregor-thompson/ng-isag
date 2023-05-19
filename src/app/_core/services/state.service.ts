import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { User } from '../../_shared/models/user';
import { Role } from '../../_shared/models/role.enum';
import { TokenService } from './token.service';
import { AppInitializerService } from '../../app-initializer.service';
import { Year } from '../../_shared/models/years/year';
import { Pairing } from '../../_shared/models/pairing';
import { Course } from '../../_shared/models/course/course';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  currentUser: User;
  isGod: boolean;
  isAdmin: boolean;
  year: Year;
  year$: BehaviorSubject<Year>;
  pageTitle$: BehaviorSubject<string> = new BehaviorSubject('Results');

  course: Course;
  formulaSlope: number;
  formulaRating: number;

  constructor(private tokenService: TokenService,
              private appInitializerService: AppInitializerService) {
    this.year = this.appInitializerService.year;
    this.year$ = new BehaviorSubject<Year>(this.year);
    if (this.tokenService.tokenHasNotExpired()) {
      this.initCurrentUser(JSON.parse(localStorage.getItem('user')));
    }
    this.course = this.appInitializerService.course;
    this.formulaSlope = this.course.slope / 113;
    this.formulaRating = this.course.courseRating - this.course.frontNinePar - this.course.backNinePar;
  }

  setTitle(title): void {
    this.pageTitle$.next(title || '');
   // document.title = `${title} | iSag`;
  }

  initCurrentUser(user: User): void {
    this.currentUser = user;
    this.isGod = user?.role === Role.GOD;
    this.isAdmin = user?.role <= Role.ADMIN;
  }

  getCourseHandicap(handicap: number): number {
    return -Math.round(-handicap * this.formulaSlope + this.formulaRating);
  }

  getPlayingHandicap(handicap: number): number {
    const courseHandicap = this.getCourseHandicap(handicap);
    return this.getPlayingHandicapFromCourseHandicap(courseHandicap);
  }

  getPlayingHandicapFromCourseHandicap(courseHandicap: number): number {
    return -Math.round(- courseHandicap * this.year.handicapAllowance / 100);
  }

  setPlayingHandicapsForPairing(p: Pairing): void {
    p.teamA.playerA.playingHandicap = this.getPlayingHandicap( p.teamA.playerA.handicap);
    p.teamA.playerB.playingHandicap = this.getPlayingHandicap( p.teamA.playerB.handicap);
    p.teamB.playerA.playingHandicap = this.getPlayingHandicap( p.teamB.playerA.handicap);
    p.teamB.playerB.playingHandicap = this.getPlayingHandicap( p.teamB.playerB.handicap);
  }

}
