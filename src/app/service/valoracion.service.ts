import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Valoracion } from '../model/Valoracion';
import { Observable } from 'rxjs';
import { Usuario } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  createValoracion(idProducto: number, valoracion: Valoracion): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/productos/${idProducto}/valoraciones`, valoracion);
  }

  updateValoracion(id: number, valoracion: Valoracion): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${id}/editar`, valoracion);
  }

  getValoracionesByUsuario(): Observable<Valoracion[]> {
    return this.http.get<Valoracion[]>(`${this.apiUrl}/usuario`);
  }

  getValoracionById(id: number): Observable<Valoracion> {
    return this.http.get<Valoracion>(`${this.apiUrl}/${id}`);
  }

  getUsuarioByValoracion(id: number): Observable<Usuario> {
    return this.http.get<any>(`${this.apiUrl}/valoraciones/${id}/usuario`);
  }

  deleteValoracion(id: number, idProducto: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/productos/${idProducto}/valoraciones/${id}`);
  }
}
