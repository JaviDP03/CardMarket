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
import { ItemPedido } from '../../../model/ItemPedido';

@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalles-producto.component.html',
  styleUrl: './detalles-producto.component.css'
})
export class DetallesProductoComponent implements OnInit {
  producto!: Producto;
  cantidad: number = 1;
  isLoggedIn: boolean = false;
  usuarioId: number | null = null;
  isAdmin: boolean = false;
  usuarioValoracion: Usuario | null = null;
  nuevaValoracion: Valoracion = new Valoracion(0, '', new Date());
  usuarioTieneValoracion: boolean = false;
  valoracionesUsuario: Valoracion[] = [];
  usuariosValoraciones: Map<number, Usuario> = new Map();
  mediaPuntuacion: number = 0;

  mostrarModal: boolean = false;
  modalTitulo: string = '';
  modalMensaje: string = '';
  modalTipo: 'info' | 'success' | 'error' | 'confirmacion' = 'info';
  accionPendiente: (() => void) | null = null;

  mostrarModalEliminar: boolean = false;
  valoracionIdParaEliminar: number | null = null;

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

  private checkLoginStatus(): void {
    this.actorService.userLogin().subscribe({
      next: (response) => {
        this.isLoggedIn = true;
        this.usuarioId = response.id;
        this.isAdmin = response.rol === 'ADMIN';
        this.cargarValoracionesUsuario();
      },
      error: (error) => {
        this.isLoggedIn = false;
        this.isAdmin = false;
        console.log('Usuario no logueado');
      }
    });
  }

  private cargarValoracionesUsuario(): void {
    if (this.isLoggedIn) {
      this.valoracionService.getValoracionesByUsuario().subscribe({
        next: (valoraciones) => {
          this.valoracionesUsuario = valoraciones;
          console.log('Valoraciones cargadas del usuario:', this.valoracionesUsuario);
          if (this.producto) {
            this.verificarValoracionUsuario();
          }
        },
        error: (error) => {
          console.error('Error al cargar valoraciones del usuario:', error);
        }
      });
    }
  }

  private cargarProducto(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.getProductoById(id).subscribe({
        next: (producto) => {
          this.producto = producto;
          this.calcularMediaPuntuacion();
          this.cargarUsuariosValoraciones();
          if (this.isLoggedIn && this.valoracionesUsuario.length > 0) {
            this.verificarValoracionUsuario();
          }
        }
      });
    }
  }

  private cargarUsuariosValoraciones(): void {
    if (this.producto?.valoraciones && this.producto.valoraciones.length > 0) {
      this.usuariosValoraciones.clear();

      this.producto.valoraciones.forEach(valoracion => {
        this.valoracionService.getUsuarioByValoracion(valoracion.id).subscribe({
          next: (usuario) => {
            this.usuariosValoraciones.set(valoracion.id, usuario);
          },
          error: (error) => {
            console.error('Error al obtener usuario de valoración:', error);
            this.usuariosValoraciones.set(valoracion.id, {
              id: 0,
              nombre: 'Usuario',
              fotoPerfil: ''
            } as unknown as Usuario);
          }
        });
      });
    }
  }

  private verificarValoracionUsuario(): void {
    if (this.producto && this.valoracionesUsuario.length > 0) {
      this.usuarioTieneValoracion = this.valoracionesUsuario.some(
        valoracion => this.producto?.valoraciones?.some(pv => pv.id === valoracion.id)
      );
    }
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
    if (this.isAdmin) {
      this.mostrarModalError('Acción no permitida', 'Los administradores no pueden añadir productos al carrito.');
      return;
    }

    if (this.producto) {
      if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', JSON.stringify([]));
      }

      let carrito: ItemPedido[] = JSON.parse(localStorage.getItem('carrito') || '[]');

      const itemExistente = carrito.find(item => item.producto.id === this.producto!.id);
      const cantidadEnCarrito = itemExistente ? itemExistente.cantidad : 0;
      const cantidadTotal = cantidadEnCarrito + this.cantidad;

      if (cantidadTotal > this.producto.stock) {
        this.mostrarModalError('Stock insuficiente', `No puedes añadir ${this.cantidad} unidades. Solo quedan ${this.producto.stock - cantidadEnCarrito} unidades disponibles.`);
        return;
      }

      if (itemExistente) {
        itemExistente.cantidad += this.cantidad;
        itemExistente.total = itemExistente.producto.precio * itemExistente.cantidad;
      } else {
        carrito.push(new ItemPedido(this.producto, this.cantidad, this.producto.precio * this.cantidad));
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      this.mostrarModalExito('Producto añadido', 'Producto añadido al carrito correctamente');
    }
  }

  establecerPuntuacion(puntuacion: number): void {
    if (!this.nuevaValoracion) {
      this.resetNuevaValoracion();
    }
    this.nuevaValoracion!.puntuacion = puntuacion;
  }

  enviarValoracion(): void {
    if (this.isAdmin) {
      this.mostrarModalError('Acción no permitida', 'Los administradores no pueden dejar valoraciones.');
      return;
    }

    if (!this.isLoggedIn || !this.producto || this.usuarioTieneValoracion) {
      return;
    }

    if (!this.nuevaValoracion || this.nuevaValoracion.puntuacion === 0) {
      this.mostrarModalError('Puntuación requerida', 'Por favor, selecciona una puntuación');
      return;
    }

    this.valoracionService.createValoracion(this.producto!.id, this.nuevaValoracion).subscribe({
      next: (valoracionCreada) => {
        this.resetNuevaValoracion();
        this.cargarProducto();
        this.cargarValoracionesUsuario();
        this.mostrarModalExito('Valoración enviada', 'Tu valoración ha sido publicada correctamente');
      },
      error: (error) => {
        console.error('Error al crear valoración:', error);
        this.mostrarModalError('Error', 'No se pudo enviar la valoración. Inténtalo de nuevo.');
      }
    });
  }

  resetNuevaValoracion(): void {
    this.nuevaValoracion = new Valoracion(0, '', new Date());
  }

  eliminarValoracion(id: number): void {
    const valoracion = this.producto?.valoraciones?.find(v => v.id === id);
    if (!valoracion) {
      this.mostrarModalError('Error', 'Valoración no encontrada.');
      return;
    }

    if (!this.isAdmin && !this.esValoracionDelUsuario(valoracion)) {
      this.mostrarModalError('Acción no permitida', 'Solo puedes eliminar tus propias valoraciones.');
      return;
    }

    this.valoracionIdParaEliminar = id;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminarValoracion(): void {
    if (this.valoracionIdParaEliminar) {
      this.valoracionService.deleteValoracion(this.valoracionIdParaEliminar, this.producto!.id).subscribe({
        next: () => {
          this.cargarProducto();
          this.cargarValoracionesUsuario();
          this.mostrarModalExito('Valoración eliminada', 'La valoración ha sido eliminada correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar valoración:', error);
          this.mostrarModalError('Error', 'No se pudo eliminar la valoración. Inténtalo de nuevo.');
        }
      });
    }
    this.cancelarEliminarValoracion();
  }

  cancelarEliminarValoracion(): void {
    this.mostrarModalEliminar = false;
    this.valoracionIdParaEliminar = null;
  }

  mostrarModalInfo(titulo: string, mensaje: string): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = 'info';
    this.mostrarModal = true;
  }

  mostrarModalExito(titulo: string, mensaje: string): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = 'success';
    this.mostrarModal = true;
  }

  mostrarModalError(titulo: string, mensaje: string): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = 'error';
    this.mostrarModal = true;
  }

  mostrarModalConfirmacion(titulo: string, mensaje: string, accion: () => void): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = 'confirmacion';
    this.accionPendiente = accion;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.accionPendiente = null;
  }

  confirmarAccion(): void {
    if (this.modalTipo === 'confirmacion' && this.accionPendiente) {
      this.accionPendiente();
    }
    this.cerrarModal();
  }

  cancelarAccion(): void {
    this.cerrarModal();
  }

  getModalHeaderClass(): string {
    switch (this.modalTipo) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'confirmacion': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  }

  getModalButtonClass(): string {
    switch (this.modalTipo) {
      case 'success': return 'bg-green-600 hover:bg-green-700';
      case 'error': return 'bg-red-600 hover:bg-red-700';
      case 'confirmacion': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  }

  redirectLogin(): void {
    this.router.navigate(['/login']);
  }

  esValoracionDelUsuario(valoracion: Valoracion): boolean {
    if (!this.isLoggedIn || !this.usuarioId) {
      console.log('Usuario no logueado');
      return false;
    }
    
    console.log('Verificando valoración ID:', valoracion.id);
    console.log('Valoraciones del usuario:', this.valoracionesUsuario.map(v => v.id));
    
    const esDelUsuario = this.valoracionesUsuario.some(v => v.id === valoracion.id);
    console.log('Es valoración del usuario:', esDelUsuario);
    
    return esDelUsuario;
  }

  array(n: number): any[] {
    return Array(n);
  }

  getUsuarioValoracion(valoracionId: number): Usuario | null {
    return this.usuariosValoraciones.get(valoracionId) || null;
  }

  private calcularMediaPuntuacion(): void {
    if (this.producto?.valoraciones && this.producto.valoraciones.length > 0) {
      const suma = this.producto.valoraciones.reduce((total, valoracion) => total + valoracion.puntuacion, 0);
      this.mediaPuntuacion = suma / this.producto.valoraciones.length;
    } else {
      this.mediaPuntuacion = 0;
    }
  }

  getEstrellasPuntuacion(): { completas: number[], medias: number[], vacias: number[] } {
    const puntuacionRedondeada = Math.round(this.mediaPuntuacion * 2) / 2; // Redondear a 0.5
    const estrellasCompletas = Math.floor(puntuacionRedondeada);
    const tieneMedia = puntuacionRedondeada % 1 !== 0;
    const estrellasVacias = 5 - estrellasCompletas - (tieneMedia ? 1 : 0);

    return {
      completas: Array(estrellasCompletas).fill(0),
      medias: tieneMedia ? [1] : [],
      vacias: Array(estrellasVacias).fill(0)
    };
  }
}
