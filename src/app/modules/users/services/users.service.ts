import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user-model';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http  = inject(HttpClient);

  API_URL = environment.API_URL;

  getUsers():Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`, {
      context: checkToken(),
    });
  }
  
}
