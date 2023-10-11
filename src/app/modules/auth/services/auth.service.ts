import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Login } from '@auth/models/login-model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http    = inject(HttpClient);
  private API_URL = environment.API_URL;

  public login( email:string, password:string ):Observable<Login> {
    return this.http.post<Login>(`${this.API_URL}/auth/login`, {email, password});
  }

}
