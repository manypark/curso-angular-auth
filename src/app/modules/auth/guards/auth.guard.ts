import { inject } from '@angular/core';
import { Router} from '@angular/router';

import { TokenService } from '../services/token.service';

export const authGuard = () => {

  const token  = inject(TokenService).getToken();
  const router = inject(Router);

  if(!token) {
    router.navigateByUrl('/login');
    return false;
  };

  return true;
};
