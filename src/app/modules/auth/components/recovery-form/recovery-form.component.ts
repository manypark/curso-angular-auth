import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestType } from '@auth/models/request-status';
import { AuthService } from '@auth/services/auth.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html',
})
export class RecoveryFormComponent {
  form = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status:RequestType = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token:string = '';

  constructor(
    private formBuilder : FormBuilder,
    private authServices: AuthService,
    private route       : ActivatedRoute,
    private router      : Router,
  ) {
    this.route.queryParamMap.subscribe( params => {

      const token = params.get('token');

      if( token ) {
        this.token = token;
      } else {
        this.router.navigateByUrl('/login');
      }

    });
  }

  recovery() {
    if (this.form.valid) {
      
      const {newPassword} = this.form.getRawValue();

      this.status = 'loading';

      this.authServices.chagePassword( this.token, newPassword ).subscribe({
        next  : () => {
          this.status = 'success';
          this.router.navigateByUrl('/login');
        },
        error : () => {
          this.status = 'error';

        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
