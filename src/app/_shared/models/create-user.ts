import { Role } from './role.enum';

export class CreateUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;

  constructor(user: Partial<CreateUser>) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.username;
    this.password = user.password;
    this.role = Role.USER;
  }

}
