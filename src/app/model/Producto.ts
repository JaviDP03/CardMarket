import { Categoria } from "./Categoria";
import { Valoracion } from "./Valoracion";

export class Producto {
    id! : number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    urlImagen: string;
    categoria: Categoria;
    valoraciones: Valoracion[];

	constructor(nombre: string, descripcion: string, precio: number, stock: number, urlImagen: string, categoria: Categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.urlImagen = urlImagen;
        this.categoria = categoria;
        this.valoraciones = [];
	}
}