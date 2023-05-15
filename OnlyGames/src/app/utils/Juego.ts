// Clase Juego
export class Juego {
  nombre: string;
  descripcion: string;
  imagen: string;
  idJuego: number;
  constructor(
    nombre: string,
    descripcion: string,
    imagen: string,
    idJuego: number
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.idJuego = idJuego;
  }
}
