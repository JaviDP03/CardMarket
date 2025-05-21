import { Actor } from "./Actor";
import { Direccion } from "./Direccion";
import { Pedido } from "./Pedido";
import { Roles } from "./Roles";

export class Usuario extends Actor {
    telefono: string;
    fechaNacimiento: Date;
    pedidos: Pedido[];
    direcciones: Direccion[];

    constructor(nombre: string, apellido: string, email: string, nombreUsuario: string, contrasenna: string, telefono: string, fechaNacimiento: Date) {
        super(nombre, apellido, email, nombreUsuario, contrasenna);
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.pedidos = [];
        this.direcciones = [];
    }
}