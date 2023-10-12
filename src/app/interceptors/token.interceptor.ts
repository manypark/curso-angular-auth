import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpContextToken, HttpContext } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

import { TokenService } from '@auth/services/token.service';
import { AuthService } from '@auth/services/auth.service';

const CHECK_TOKEN = new HttpContextToken<boolean>( () => false );

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  tokenServices = inject(TokenService);
  authServices  = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(CHECK_TOKEN)) {
      const isValidToken = this.tokenServices.isValidToken(); // accessToken
      if (isValidToken) {
        return this.addToken(request, next);
      } else {
        return this.updateAccessTokenAndRefreshToken(request, next);
      }
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const accessToken = this.tokenServices.getToken();
    if (accessToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authRequest);
    }
    return next.handle(request);
  }

  private updateAccessTokenAndRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const refreshToken = this.tokenServices.getRefreshToken();
    const isValidRefreshToken = this.tokenServices.isValidRefreshToken();
    if (refreshToken && isValidRefreshToken) {
      return this.authServices.refreshToken(refreshToken)
      .pipe(
        switchMap(() => this.addToken(request, next)),
      )
    }
    return next.handle(request);
  }

}
