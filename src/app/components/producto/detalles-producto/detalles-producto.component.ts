import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../../model/Producto';
import { Valoracion } from '../../../model/Valoracion';
import { ProductoService } from '../../../service/producto.service';
import { ActorService } from '../../../service/actor.service';
import { ValoracionService } from '../../../service/valoracion.service';
import { Usuario } from '../../../model/Usuario';

@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalles-producto.component.html',
  styleUrl: './detalles-producto.component.css'
})
export class DetallesProductoComponent implements OnInit {
  producto: Producto | null = null;
  cantidad: number = 1;
  isLoggedIn: boolean = false;
  usuarioId: number | null = null;
  usuarioValoracion: Usuario | null = null;
  nuevaValoracion: Valoracion = new Valoracion(0, '', new Date());
  
  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private actorService: ActorService,
    private valoracionService: ValoracionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarProducto();
    this.checkLoginStatus();
  }

  private cargarProducto(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.getProductoById(id).subscribe({
        next: (producto) => this.producto = producto
      });
    }
  }

  private checkLoginStatus(): void {
    this.actorService.userLogin().subscribe({
      next: (response) => {
        this.isLoggedIn = true;
        this.usuarioId = response.id;
      }
    });
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  incrementarCantidad(): void {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  agregarAlCarrito(): void {
    if (this.producto) {
      // Aquí agregarías la lógica para añadir al carrito
      console.log(`Agregando ${this.cantidad} unidades del producto ${this.producto.nombre} al carrito`);
      // Por ejemplo:
      // this.carritoService.agregarProducto(this.producto, this.cantidad);
      
      // Mensaje de confirmación
      alert(`Se han añadido ${this.cantidad} unidades de ${this.producto.nombre} al carrito`);
    }
  }

  establecerPuntuacion(puntuacion: number): void {
    if (!this.nuevaValoracion) {
      this.resetNuevaValoracion();
    }
    this.nuevaValoracion!.puntuacion = puntuacion;
  }

  enviarValoracion(): void {
    if (!this.isLoggedIn || !this.producto) {
      return;
    }

    if (!this.nuevaValoracion || this.nuevaValoracion.puntuacion === 0) {
      alert('Por favor, selecciona una puntuación');
      return;
    }
    
    this.valoracionService.createValoracion(this.producto!.id, this.nuevaValoracion).subscribe(valoracionCreada => {
      this.resetNuevaValoracion();
    });
    
    console.log('Enviando valoración:', this.nuevaValoracion);
    this.resetNuevaValoracion();
  }

  resetNuevaValoracion(): void {
    this.nuevaValoracion = new Valoracion(0, '', new Date());
  }

  eliminarValoracion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta valoración?')) {
      // this.valoracionesService.eliminarValoracion(id).subscribe({
      //   next: () => {
      //     if (this.producto && this.producto.valoraciones) {
      //       this.producto.valoraciones = this.producto.valoraciones.filter(v => v.id !== id);
      //     }
      //   }
      // });
      console.log('Eliminando valoración con ID:', id);
    }
  }

  esValoracionDelUsuario(valoracion: Valoracion): any {
    this.valoracionService.getValoracionesByUsuario().subscribe({
      next: (valoraciones) => {
        return valoraciones.some(v => v.id === valoracion.id);
      },
      error: (error) => {
        console.error('Error al verificar la valoración del usuario:', error);
        return false;
      }
    });
  }
  
  getUsuarioValoracion(id: number): void {
    this.valoracionService.getUsuarioByValoracion(id).subscribe({
      next: (usuario) => {
        this.usuarioValoracion = usuario;
      },
      error: (error) => {
        console.error('Error al obtener el usuario de la valoración:', error);
      }
    });
  }

  redirectLogin(): void {
    this.router.navigate(['login']);
  }

  // Método auxiliar para generar arrays para las estrellas
  array(n: number): any[] {
    return Array(n);
  }
}
