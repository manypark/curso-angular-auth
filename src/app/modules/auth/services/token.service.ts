import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken( token:string ) {
    setCookie('token', token, {
      expires : 1,
      path    : '/'
    });
  }

  getToken():string {
    const token = getCookie('token');
    return token!;
  }

  removeToken() {
    removeCookie('token');
  }

}
