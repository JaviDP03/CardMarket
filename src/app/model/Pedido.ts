import { Direccion } from "./Direccion";
import { ItemPedido } from "./ItemPedido";

export class Pedido {
    id!: number;
    fechaCreacion: Date;
    direccion: Direccion;
    items: ItemPedido[];

    constructor(fechaCreacion: Date, direccion: Direccion, items: ItemPedido[]) {
        this.fechaCreacion = fechaCreacion;
        this.direccion = direccion;
        this.items = items;
    }
}