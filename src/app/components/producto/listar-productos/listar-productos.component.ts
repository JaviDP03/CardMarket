import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../service/producto.service';
import { Producto } from '../../../model/Producto';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../../service/categoria.service';

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
    private categoriaService: CategoriaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoriaActual = params.get('nombre');
      this.loadProductos();
    });
  }

  loadProductos(): void {
    this.loading = true;
    this.error = null;
    
    if (this.categoriaActual) {
      // Normalize category names
      const normalizedCategory = this.categoriaActual
        .replace('cartas', 'carta')
        .replace('colecciones', 'coleccion');
      
      // First get the category ID, then use it to fetch products
      this.categoriaService.getCategoriaByNombre(normalizedCategory).subscribe({
        next: (categoria) => {
          const idCategoria = categoria.id;
          console.log(idCategoria);
          // Only fetch products after we have the category ID
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
        },
        error: (err) => {
          this.error = 'Error al cargar la categoría';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
