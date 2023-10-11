import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestType } from '@auth/models/request-status';
import { AuthService } from '@auth/services/auth.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  form = this.formBuilder.nonNullable.group({
    name          : ['', [Validators.required]],
    email         : ['', [Validators.email, Validators.required]],
    password      : ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });

  status:RequestType = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  errorMsg:String = '';

  constructor(
    private formBuilder : FormBuilder,
    private router      : Router,
    private authServices: AuthService
  ) {}

  register() {
    if (this.form.valid) {

      this.status = 'loading';

      const { name, email, password } = this.form.getRawValue();

      this.authServices.register( name, email, password ).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigateByUrl('/login');
        },
        error: ( err ) => {

          this.status = 'error';

          if( err.error.code == 'SQLITE_CONSTRAINT_UNIQUE' ) {
            this.errorMsg = 'Already registered user';
          }

        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
