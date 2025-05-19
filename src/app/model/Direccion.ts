export class Direccion {
    id!: number;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    provincia: string;
    pais: string;


	constructor(direccion: string, codigoPostal: string, ciudad: string, provincia: string, pais: string) {
        this.direccion = direccion;
        this.codigoPostal = codigoPostal;
        this.ciudad = ciudad;
        this.provincia = provincia;
        this.pais = pais;
	}
}