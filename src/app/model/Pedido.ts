import { Direccion } from "./Direccion";
import { ItemPedido } from "./ItemPedido";

export class Pedido {
    id!: number;
    total: number;
    fechaCreacion: Date;
    direccion: Direccion;
    items: ItemPedido[];

    constructor(total: number, fechaCreacion: Date, direccion: Direccion, items: ItemPedido[]) {
        this.total = total;
        this.fechaCreacion = fechaCreacion;
        this.direccion = direccion;
        this.items = items;
    }
}