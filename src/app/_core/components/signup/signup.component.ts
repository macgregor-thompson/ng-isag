import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { CreateUser } from '../../../_shared/models/create-user';

@Component({
  selector: 'isag-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  user = new CreateUser();
  foo = false;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.stop();
  }

  signup(): void {
    this.foo = true;
  }

}
