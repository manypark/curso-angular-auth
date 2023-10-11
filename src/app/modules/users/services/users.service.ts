import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenService } from '@auth/services/token.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http  = inject(HttpClient);
  private token = inject(TokenService).getToken();

  API_URL = environment.API_URL;

  getUsers():Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  
}
