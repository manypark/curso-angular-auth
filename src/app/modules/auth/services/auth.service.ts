import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

import { Login } from '@auth/models/login-model';
import { environment } from '@environments/environment';
import { TokenService } from './token.service';
import { User } from '../../users/models/user-model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http          = inject(HttpClient);
  private tokenServices = inject(TokenService);
  private API_URL       = environment.API_URL;
  public user$          = new BehaviorSubject<User| null>(null);

  public login( email:string, password:string ):Observable<Login> {
    return this.http.post<Login>(`${this.API_URL}/auth/login`, {email, password}).pipe(
      tap( (res:Login) => {
          this.tokenServices.saveToken(res.access_token);
          this.tokenServices.saveRefreshToken(res.refresh_token);
        }
      )
    );
  }

  public register( name:string, email:string, password:string ) {
    return this.http.post(`${this.API_URL}/auth/register`, { name, email, password });
  }

  public registerAndLogin( name:string, email:string, password:string ) {

    return this.register( name, email, password ).pipe(
      switchMap( () => this.login(email, password) )
    );
  }
  
  public isAvailableUser( email:string ) {
    return this.http.post<{isAvailable:boolean}>(`${this.API_URL}/auth/is-available`, { email });
  }
  
  public recovery( email:string ) {
    return this.http.post<{link:string, recoveryToken:string}>(`${this.API_URL}/auth/recovery`, { email });
  }

  public chagePassword( token:string, newPassword:string ) {
    return this.http.post<{link:string, recoveryToken:string}>(`${this.API_URL}/auth/change-password`, { token, newPassword });
  }

  logout() {
    this.tokenServices.removeToken();
  }

  profile():Observable<User> {

    return this.http.get<User>(`${this.API_URL}/auth/profile`, {
      context: checkToken()
    }).pipe(
      tap( user => this.user$.next(user) ),
    );
  }

  getDataUser() {
    return this.user$.getValue();
  }

  refreshToken( refreshToken:string ) {
    return this.http.post<Login>(`${this.API_URL}/auth/refresh-token`, { refreshToken }).pipe(
        tap( (res:Login) => {
            this.tokenServices.saveToken(res.access_token);
            this.tokenServices.saveRefreshToken(res.refresh_token);
          }
        )
    );
  }

}
