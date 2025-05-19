export class Valoracion {
    id!: number;
    puntuacion: number;
    comentario: string;
    fechaPublicacion: Date;

    constructor(puntuacion: number, comentario: string, fechaPublicacion: Date) {
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fechaPublicacion = fechaPublicacion;
    }
}