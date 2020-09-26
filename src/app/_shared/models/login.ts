import { User } from './user';

export class Login {
  username = '';
  password = '';
}

export interface LoginResponse {
  user: User;
  access_token: string;
}
