import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Valoracion } from '../model/Valoracion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  private apiUrl = `${environment.apiUrl}/valoraciones`;

  constructor(private http: HttpClient) { }

  createValoracion(valoracion: Valoracion): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, valoracion);
  }

  updateValoracion(id: number, valoracion: Valoracion): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${id}/editar`, valoracion);
  }

  getAllValoraciones(): Observable<Valoracion[]> {
    return this.http.get<Valoracion[]>(this.apiUrl);
  }

  getValoracionById(id: number): Observable<Valoracion> {
    return this.http.get<Valoracion>(`${this.apiUrl}/${id}`);
  }

  deleteValoracion(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
