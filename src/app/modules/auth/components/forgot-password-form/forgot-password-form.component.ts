import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestType } from '@auth/models/request-status';
import { AuthService } from '@auth/services/auth.service';
@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html'
})
export class ForgotPasswordFormComponent {

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });

  status    : RequestType = 'init';
  emailSent : boolean = false;

  constructor(
    private formBuilder : FormBuilder,
    private authServices: AuthService,
    private router      : Router,
  ) { }

  sendLink() {
    if (this.form.valid) {

      this.status = 'loading';

      const { email } = this.form.getRawValue();
      
      this.authServices.recovery(email).subscribe({
        next: ( res ) =>  {
          this.status = 'success';
          this.emailSent = true;

          setTimeout(() => {
            this.router.navigate(['/recovery'], {
              queryParams: {
                token: res.recoveryToken
              }
            });
          }, 3000);

        },
        error: () => {
          this.status = 'error';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
