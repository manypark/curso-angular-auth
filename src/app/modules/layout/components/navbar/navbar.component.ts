import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  authServices = inject(AuthService);
  router       = inject(Router);

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;

  user$ = this.authServices.user$;

  logout() {
    this.authServices.logout();
    this.router.navigateByUrl('/login');
  }

  // ngOnInit(): void {
  //   this.authServices.profile().subscribe( user => {
  //     this.user = user;
  //   });
  // }

}
