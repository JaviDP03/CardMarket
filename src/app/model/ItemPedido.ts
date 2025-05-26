import { Producto } from "./Producto";

export class ItemPedido {
    id!: number;
    producto: Producto
    cantidad: number;
    total: number;

    constructor(producto: Producto, cantidad: number, total: number) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.total = total;
    }
}