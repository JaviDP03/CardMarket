import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../service/producto.service';
import { Producto } from '../../../model/Producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-admin',
  imports: [CommonModule],
  templateUrl: './productos-admin.component.html',
  styleUrl: './productos-admin.component.css'
})
export class ProductosAdminComponent implements OnInit {
  productos: Producto[] = [];
  loading: boolean = true;
  showDeleteModal = false;
  showErrorModal = false;
  errorMessage = '';
  productToDelete: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
      }
    });
  }

  crearProducto(): void {
    this.router.navigate(['/productos/crear']);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/productos', id, 'editar']);
  }

  eliminarProducto(producto: Producto): void {
    this.productToDelete = producto;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.productoService.deleteProducto(this.productToDelete.id).subscribe({
        next: (success) => {
          if (success) {
            this.cargarProductos();
            console.log('Producto eliminado con ID:', this.productToDelete!.id);
          }
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.errorMessage = 'No se puede eliminar el producto porque probablemente está incluido en uno o más pedidos.';
          this.showErrorModal = true;
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }
}
