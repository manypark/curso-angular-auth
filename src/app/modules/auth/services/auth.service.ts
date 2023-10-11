import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, switchMap, tap } from 'rxjs';

import { Login } from '@auth/models/login-model';
import { environment } from '@environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http          = inject(HttpClient);
  private tokenServices = inject(TokenService);
  private API_URL       = environment.API_URL;

  public login( email:string, password:string ):Observable<Login> {
    return this.http.post<Login>(`${this.API_URL}/auth/login`, {email, password}).pipe(
      tap( (res:Login) => this.tokenServices.saveToken(res.access_token) )
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

}
