import { inject } from '@angular/core';
import { Router} from '@angular/router';

import { TokenService } from '../services/token.service';

export const authGuard = () => {

  const isValiTtoken  = inject(TokenService).isValidRefreshToken();
  const router = inject(Router);

  if(!isValiTtoken) {
    router.navigateByUrl('/login');
    return false;
  };

  return true;
};
