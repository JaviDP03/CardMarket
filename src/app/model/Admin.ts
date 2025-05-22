import { Actor } from "./Actor";

export class Admin extends Actor {
    fechaCreacion!: Date;

	constructor(nombre: string, apellido: string, email: string, nombreUsuario: string, contrasenna: string, urlImagen: string) {
        super(nombre, apellido, email, nombreUsuario, contrasenna, urlImagen);
	}
}