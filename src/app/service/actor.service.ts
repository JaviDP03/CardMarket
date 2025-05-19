import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../model/Login';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private apiUrl = 'environment.apiUrl';

  constructor(private http: HttpClient) { }

  login(login: Login) {
    return this.http.post(`${this.apiUrl}/login`, login);
  }
}
