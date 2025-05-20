import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../model/Pedido';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) { }

  createPedido(pedido: Pedido): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, pedido);
  }

  updatePedido(id: number, pedido: Pedido): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${id}/editar`, pedido);
  }

  getAllPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  getPedidoById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  deletePedido(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
