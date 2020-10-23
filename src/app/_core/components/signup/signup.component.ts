import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, FormBuilder, ValidationErrors, AbstractControl } from '@angular/forms';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserService } from '../../services/user.service';
import { CreateUser } from '../../../_shared/models/create-user';
import { SpinnerService } from '../../services/spinner.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'isag-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private spinnerService: SpinnerService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.spinnerService.stop();
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', { validators: [Validators.required, Validators.minLength(4)],
        asyncValidators: [this.validateUsername], updateOn: 'blur' }],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordsMatch,
    });
  }


  signup() {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    const newUser = new CreateUser(this.registerForm.value);
    this.authService.signup(newUser).subscribe();
  }


  passwordsMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    const error = password && confirmPassword && password.value !== confirmPassword.value ? { passwordsMatch: true } : null;
    confirmPassword.setErrors(error);
    return error;
  }

  validateUsername: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return this.userService.isUserNameTaken(control.value)
      .pipe(
        map(isTaken => (isTaken ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      );
  }


  getEmailErrorMessage() {
    if (this.f.email.hasError('required'))
      return 'You must enter a value';
    return this.f.email.hasError('email') ? 'Not a valid email' : '';
  }

  get f() {
    return this.registerForm.controls;
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }


}
