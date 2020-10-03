import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../../_shared/models/login';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'isag-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  auth = new Login();
  loginFailed: boolean;

  constructor(private authService: AuthService,
              private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerService.stop();
  }

  login() {
    if (this.auth.username.length && this.auth.password?.length)
      this.authService.login(this.auth).subscribe({
        error: e => {
          if (e.statusCode === 401) this.loginFailed = true;
        }
      });
  }

}
