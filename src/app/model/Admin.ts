import { Actor } from "./Actor";
import { Roles } from "./Roles";

export class Admin extends Actor {
    fechaCreacion: Date;

	constructor(nombre: string, apellido: string, email: string, nombreUsuario: string, contrasenna: string, rol: Roles) {
        super(nombre, apellido, email, nombreUsuario, contrasenna, rol);
        this.fechaCreacion = new Date();
	}
}