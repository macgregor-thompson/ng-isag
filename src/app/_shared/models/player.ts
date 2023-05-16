export class Player {
  _id: string;
  firstName = '';
  lastName = '';
  avatarUrl?: string;
  email: string;
  phoneNumber: string;
  handicap: number;
  deleted: boolean;
  bio: string;
  nickname: string;
  city: string;
  state: string;
  yearsWon: number[];
  dateOfBirth: Date;
  favoriteActivities: Activity[];
  constructor(firstName = '', lastName = '', handicap?: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.handicap = handicap;
  }
}

export class Activity {
  title: string;
}
