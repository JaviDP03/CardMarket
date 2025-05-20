import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Direccion } from '../model/Direccion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private apiUrl = `${environment.apiUrl}/direcciones`;

  constructor(private http: HttpClient) { }

  createDireccion(direccion: Direccion): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, direccion);
  }

  updateDireccion(id: number, direccion: Direccion): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${id}/editar`, direccion);
  }

  getAllDirecciones(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(this.apiUrl);
  }

  getDireccionById(id: number): Observable<Direccion> {
    return this.http.get<Direccion>(`${this.apiUrl}/${id}`);
  }

  deleteDireccion(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
