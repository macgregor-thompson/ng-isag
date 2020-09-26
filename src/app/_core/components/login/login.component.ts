import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../../_shared/models/login';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'isag-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  auth = new Login();
  loginFailed: boolean;

  constructor(private authService: AuthService,
              private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerService.stop();
    document.body.classList.add('magnolia');
  }

  ngOnDestroy() {
   // document.body.classList.remove('magnolia');
  }

  login() {
    this.authService.login(this.auth).subscribe( {
      error: e => {
        console.log('error logging in:', e);
      }
    });
  }

}
