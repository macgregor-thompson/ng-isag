import { Expense } from './expense';

export class Year {
  _id: string;
  year: number;
  date: Date;
  current: boolean;
  public: boolean;
  completed: boolean;
  aPlayerIds: string[];
  bPlayerIds: string[];
  deleted: true;

  paidPLayerIds: string[];
  playerDues: number;
  expenses: Expense[];
  prizes: Expense[];
  firstPlacePercentage = 60;
  secondPlacePercentage = 30;
  thirdPlacePercentage = 10;

  constructor(year) {
    this.year = year;

    const date = new Date(`4/1/${this.year}`);
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1);
    }
    this.date = date;
  }
}
