import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../service/producto.service';
import { CategoriaService } from '../../../service/categoria.service';
import { Producto } from '../../../model/Producto';
import { Categoria } from '../../../model/Categoria';

@Component({
  selector: 'app-form-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent implements OnInit {
  producto!: Producto;
  categorias: Categoria[] = [];
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  isEditMode = false;
  buttonText = '';
  productoId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCategorias();
    this.checkEditMode();
  }

  initializeForm() {
    this.producto = new Producto('', '', 0, 0, '', new Categoria('', '', ''));
  }

  loadCategorias() {
    this.categoriaService.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  checkEditMode() {
    const url = this.router.url;
    const urlSegments = url.split('/');
    this.buttonText = urlSegments[urlSegments.length - 1];
    
    if (this.buttonText === 'editar') {
      this.isEditMode = true;
      this.productoId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.productoId) {
        this.loadProducto(this.productoId);
      }
    } else {
      this.buttonText = 'crear';
      this.isEditMode = false;
    }
  }

  loadProducto(id: number) {
    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        this.producto = producto;
      },
      error: (error) => {
        this.message = 'Error al cargar el producto';
        this.messageType = 'error';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        this.producto.imagenB64 = base64Data;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageSrc(): string {
    if (!this.producto.imagenB64) return '';
    
    // Si ya tiene el prefijo data:image, devolverlo tal como está
    if (this.producto.imagenB64.startsWith('data:image/')) {
      return this.producto.imagenB64;
    }
    
    // Si no tiene el prefijo, añadirlo (para imágenes cargadas desde el servidor)
    return `data:image/jpeg;base64,${this.producto.imagenB64}`;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isLoading = true;
      
      if (this.isEditMode && this.productoId) {
        this.updateProducto();
      } else {
        this.createProducto();
      }
    }
  }

  createProducto() {
    this.productoService.createProducto(this.producto).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/productosadmin']);
        } else {
          this.message = 'Error al crear el producto';
          this.messageType = 'error';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Error al crear el producto';
        this.messageType = 'error';
      }
    });
  }

  updateProducto() {
    this.productoService.updateProducto(this.productoId!, this.producto).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/productosadmin']);
        } else {
          this.message = 'Error al actualizar el producto';
          this.messageType = 'error';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Error al actualizar el producto';
        this.messageType = 'error';
      }
    });
  }

  validateForm(): boolean {
    return !!(this.producto.nombre && this.producto.descripcion && 
              this.producto.precio > 0 && this.producto.stock >= 0 && 
              this.producto.imagenB64 && this.producto.categoria.id);
  }

  resetForm() {
    this.producto = new Producto('', '', 0, 0, '', new Categoria('', '', ''));
    this.message = '';
  }
}
