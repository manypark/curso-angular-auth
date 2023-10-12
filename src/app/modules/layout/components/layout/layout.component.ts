import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector    : 'app-layout',
  templateUrl : './layout.component.html',
})
export class LayoutComponent implements OnInit {

  authServices = inject(AuthService);

  ngOnInit(): void {
    this.authServices.profile().subscribe();
  }

}
