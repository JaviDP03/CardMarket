import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../service/producto.service';
import { Producto } from '../../../model/Producto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements OnInit {
  productos: Producto[] = [];
  categoriaActual: string | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoriaActual = params.get('categoria');
      this.loadProductos();
    });
  }

  loadProductos(): void {
    this.loading = true;
    this.error = null;
    
    if (this.categoriaActual) {
      // Convert category name to ID (you might need a more robust mapping)
      const idCategoria = this.categoriaActual === 'coleccion' ? 1 : 
                         this.categoriaActual === 'carta' ? 2 : 0;
      
      if (idCategoria > 0) {
        this.productoService.getProductosByCategoria(idCategoria).subscribe({
          next: (data) => {
            this.productos = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error al cargar los productos por categoría';
            this.loading = false;
            console.error(err);
          }
        });
      } else {
        this.getAllProductos();
      }
    } else {
      this.getAllProductos();
    }
  }

  getAllProductos(): void {
    this.productoService.getAllProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
