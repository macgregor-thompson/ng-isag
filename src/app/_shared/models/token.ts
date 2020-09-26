import { User } from './user';

export interface Token extends User {
  iat: number;
  exp: number;
}
