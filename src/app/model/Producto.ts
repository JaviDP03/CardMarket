import { Categoria } from "./Categoria";
import { Valoracion } from "./Valoracion";

export class Producto {
    id! : number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenB64: string;
    categoria: Categoria;
    valoraciones: Valoracion[];

	constructor(nombre: string, descripcion: string, precio: number, stock: number, imagenB64: string, categoria: Categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagenB64 = imagenB64;
        this.categoria = categoria;
        this.valoraciones = [];
	}
}