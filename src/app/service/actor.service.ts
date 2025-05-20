import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../model/Login';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, login);
  }

  findbyUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/actor/${username}`);
  }
}
