export class Year {
  _id: string;
  year: number;
  date: Date;
  current: boolean;
  public: boolean;
  completed: boolean;
  aPlayerIds: string[];
  bPlayerIds: string[];

  constructor(year) {
    this.year = year;

    const date = new Date(`4/1/${this.year}`);
    while (date.getDay() !== 6) {
      date.setDate(date.getDate() + 1);
    }
    this.date = date;
  }
}
