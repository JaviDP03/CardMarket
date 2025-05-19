export class ItemPedido {
    id!: number;
    cantidad: number;
    total: number;

    constructor(cantidad: number, total: number) {
        this.cantidad = cantidad;
        this.total = total;
    }
}