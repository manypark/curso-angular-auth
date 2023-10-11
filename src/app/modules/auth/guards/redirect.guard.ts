import { inject } from '@angular/core';
import { Router} from '@angular/router';

import { TokenService } from '../services/token.service';

export const redirectGuard = () => {

  const token  = inject(TokenService).getToken();
  const router = inject(Router);

  if(token) {
    router.navigateByUrl('/app/boards');
  };

  return true;
};