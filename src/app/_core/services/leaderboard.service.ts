import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  scores = [];

  constructor(private socket: Socket) {
    this.socket.on('scorecardUpdated', (data) => {
      // update leaderboard
      console.log('fetch scorecard');
    });

    // on connect, re-fetch entire scorecard

    this.socket.on('connect', (data) => {
      console.log('connect', data);
    });

    this.socket.on('disconnect', (data) => {
      console.log('disconnect', data);
    });

    this.socket.on('events', (data) => {
      this.scores.push(data);
      console.log('events', data);
    });

  }

  sendEvent(foo: string) {
    this.socket.emit('events', foo);
  }

  addScore(score: string) {
    this.socket.emit('scores', score);
  }

}
