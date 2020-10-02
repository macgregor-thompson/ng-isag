import { Course } from '../course/course';
import { Score } from './score';
import { Team } from '../teams/team';

export class Scorecard {
  year: number;
  teamId: string;
  playerAScores: Score[];
  playerBScores: Score[];
  netScores: Score[];
  totalScore: number;
  courseId: string;

  // aggregation
  course: Course;
  team: Team;
}
