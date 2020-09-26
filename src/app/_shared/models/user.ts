import { Role } from './role.enum';

export class User {
  _id: string;
  firstName: string;
  lastName: string;
  role: Role;
  playerId?: string;
}
