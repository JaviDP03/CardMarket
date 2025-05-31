import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  loading: boolean = false;
  error: string | null = null;
  private validCategories = ['cartas', 'colecciones'];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoriaActual = params.get('nombreCategoria');
      
      if (this.categoriaActual && !this.validCategories.includes(this.categoriaActual)) {
        this.router.navigate(['/notfound']);
        return;
      }
      
      this.loadProductos();
    });
  }

  loadProductos(): void {
    this.error = null;
    this.productos = [];
    
    if (this.categoriaActual) {
      this.loading = true;
      console.log("dos");

      const normalizedCategory = this.categoriaActual
        .replace('cartas', 'carta')
        .replace('colecciones', 'coleccion');
      
      this.categoriaService.getCategoriaByNombre(normalizedCategory).subscribe({
        next: (categoria) => {
          const idCategoria = categoria.id;
          console.log(idCategoria);
          this.productoService.getProductosByCategoria(idCategoria).subscribe({
            next: (data) => {
              this.productos = data || [];
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
          this.router.navigate(['/404']);
          console.error('Category not found:', err);
        }
      });
    } else {
      this.loading = false;
    }
  }
}
