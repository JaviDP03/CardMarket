import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../model/Admin';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  createAdmin(admin: Admin): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, admin);
  }

  updateAdmin(admin: Admin): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/editar`, admin);
  }

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl);
  }

  getAdminById(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/${id}`);
  }

  deleteAdmin(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  backupDatabase(): Observable<any> {
    return this.http.get(`${this.apiUrl}/backupbd`);
  }
}
