import { inject } from '@angular/core';
import { Router} from '@angular/router';

import { TokenService } from '../services/token.service';

export const redirectGuard = () => {

  const isValidToken  = inject(TokenService).isValidRefreshToken();
  const router = inject(Router);

  if( isValidToken ) {
    router.navigateByUrl('/app/boards');
  };

  return true;
};