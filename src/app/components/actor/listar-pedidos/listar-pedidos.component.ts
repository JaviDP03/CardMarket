import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../service/pedido.service';
import { Pedido } from '../../../model/Pedido';

@Component({
  selector: 'app-listar-pedidos',
  imports: [CommonModule],
  templateUrl: './listar-pedidos.component.html',
  styleUrl: './listar-pedidos.component.css'
})
export class ListarPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  loading = true;
  error = '';

  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.loading = true;
    this.pedidoService.getPedidosByUsuario().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los pedidos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  calcularTotalPedido(pedido: Pedido): number {
    return pedido.items.reduce((total, item) => total + (item.total), 0);
  }
}
