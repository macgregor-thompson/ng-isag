import { Injectable } from '@angular/core';

import { Year } from './_shared/models/years/year';
import { Player } from './_shared/models/player';
import { Course } from './_shared/models/course/course';

type BlockingResponses = [
  Year[],
  Course[],
  Player[],
];

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  years: Year[];
  year: Year;

  courses: Course[];
  course: Course;

  allPlayers: Player[];

  constructor() { }

  async initialize(): Promise<void> {
    const responses = await Promise.all([
      fetch('api/years'),
      fetch('api/courses'),
      fetch('api/players'),
    ]);

    const [years, courses, allPlayers] =
      (await Promise.all(responses.map(r => r.json()))) as BlockingResponses;

    this.years = years;
    const params = new URLSearchParams(window.location.search);
    const queryYear = params.get('year');
    const year = queryYear ? this.years.find(y => y.year === parseInt(queryYear, 10)) : null;
    this.year = year || this.years.find(y => y.current)
      || this.years.reduce((prev, current) => (prev?.year > current?.year) ? prev : current);

    this.courses = courses;
    this.course = courses.find(c => c.year === this.year.year);

    this.allPlayers = allPlayers;
  }
}
