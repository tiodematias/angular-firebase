import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Dog } from './../core/dog';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  private _API = 'http://localhost:1337/api';
  private _accessToken = localStorage.getItem('access_token');

  constructor(
    private http: HttpClient,
    public auth: AuthService) { }

  getDogs$(): Observable<Dog[]> {
    return this.http
      .get(`${this._API}/dogs`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this._accessToken}`)
      })
      .catch(this._handleError);
  }

  getDogByRank$(rank: number): Observable<Dog> {
    return this.http
      .get(`${this._API}/dog/${rank}`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this._accessToken}`)
      })
      .catch(this._handleError);
  }

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1 || err.message.indexOf('UnauthorizedError') > -1) {
      this.auth.logout();
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

}