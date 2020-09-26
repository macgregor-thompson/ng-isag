import { User } from './user';

export interface AccessToken extends User {
  iat: number;
  exp: number;
}
