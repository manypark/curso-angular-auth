import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '@auth/services/auth.service';
import { RequestType } from '@auth/models/request-status';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {

  form = this.formBuilder.nonNullable.group({
    email   : ['', [ Validators.email, Validators.required]],
    password: ['', [ Validators.required, Validators.minLength(6)]],
  });
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status:RequestType = 'init';

  constructor(
    private formBuilder   : FormBuilder,
    private router        : Router,
    private route         : ActivatedRoute,
    private loginServices : AuthService
  ) {
    this.route.queryParamMap.subscribe( params => {

      const email = params.get('email');  

      if(email) {
        this.form.controls.email.setValue(email);
      }
    });
  }

  doLogin() {

    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    };

    this.status = 'loading';

    const { email, password } = this.form.getRawValue();

    this.loginServices.login(email, password).subscribe({
      next: () => {
        this.status = 'success';
        this.router.navigateByUrl('/app');
      },
      error: () => {
        this.status = 'error';
      }
    });

  }

}

