import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../model/Producto';
import { Observable } from 'rxjs';
import { Valoracion } from '../model/Valoracion';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) { }

  createProducto(producto: Producto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: Producto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${id}/editar`, producto);
  }

  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  getProductosByCategoria(idCategoria: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${idCategoria}`);
  }

  getValoraciones(id: number): Observable<Valoracion[]> {
    return this.http.get<Valoracion[]>(`${this.apiUrl}/${id}/valoraciones`);
  }

  deleteProducto(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
