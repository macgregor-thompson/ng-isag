export class Player {
  _id: string;
  firstName = '';
  lastName = '';
  avatarUrl?: string;
  email: string;
  phoneNumber: string;
  handicap;
  deleted: boolean;
  bio: string;
  nickname: string;
  city: string;
  state: string;
  iSagWinner: boolean;
  dateOfBirth: Date;
  favoriteActivities: Activity[];
  constructor(firstName?: string, lastName?: string, handicap?: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.handicap = handicap;
  }
}

export class Activity {
  title: string;
}
