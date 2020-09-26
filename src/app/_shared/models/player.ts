export class Player {
  _id: string;
  firstName = '';
  lastName = '';
  avatarUrl?: string;
  email: string;
  phoneNumber: string;
  handicap = 0;
  deleted: boolean;
  bio: string;
  nickname: string;
  city: string;
  state: string;
  iSagWinner: boolean;
  dateOfBirth: Date;
  age: number;
  favoriteActivities: Activity[];
}

export class Activity {
  title: string;
}
