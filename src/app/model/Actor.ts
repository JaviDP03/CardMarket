import { Roles } from "./Roles";

export abstract class Actor {
    id!: number;
    nombreUsuario: string;
    contrasenna: string;
    nombre: string;
    apellido: string;
    email: string;
    urlImagen: string
    rol!: Roles;


    constructor(nombre: string, apellido: string, email: string, nombreUsuario: string, contrasenna: string, urlImagen: string) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.nombreUsuario = nombreUsuario;
        this.contrasenna = contrasenna;
        this.urlImagen = urlImagen;
    }
}