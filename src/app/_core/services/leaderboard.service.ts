import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  scores = [];

  constructor(private socket: Socket) {
    this.socket.on('scores', (data) => {
      // update leaderboard
      this.scores.push(data);
    });

    // on connect, re-fetch entire scorecard

    this.socket.on('connect', (data) => {
      console.log('connect', data);
    });

    this.socket.on('disconnect', (data) => {
      console.log('disconnect', data);
    });
  }

  addScore(score: string) {
    this.socket.emit('scores', score);
  }

}
