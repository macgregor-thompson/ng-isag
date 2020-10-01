import { Component, OnInit } from '@angular/core';
import { User } from '../../_shared/models/user';
import { UserService } from '../../_core/services/user.service';
import { Role } from '../../_shared/models/role.enum';

@Component({
  selector: 'isag-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[];
  Role = Role;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
   this.userService.getAll().subscribe({
     next: u => this.users = u
   });
  }

}
