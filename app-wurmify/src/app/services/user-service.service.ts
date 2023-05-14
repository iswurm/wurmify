import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, lastValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiRestUrl = 'http://localhost:3977/api/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

  public identity: any;
  public token: any;

  constructor(private http: HttpClient) { }

  login(user: any, gethash: boolean | null): Observable<any> {
    if (gethash != null) {
      user.gethash = gethash;
    }
    let params = JSON.stringify(user);
    return this.http.post(this.apiRestUrl + 'login', params, this.httpOptions);

  }

  register(userToRegister: any){
    //VALIDAR!!!!
    let params = JSON.stringify(userToRegister);
    return this.http.post(this.apiRestUrl + 'register', params, this.httpOptions);

  }

  getIdentity() {
    try {
      let identity = JSON.parse(localStorage.getItem('identity') || '');
      if (identity != "undefined" || identity != '') {
        this.identity = identity;
      } else {
        this.identity = null;
      }
      return this.identity;
    } catch (error) {
      return null;
    }

  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }
    return token;

  }
}
