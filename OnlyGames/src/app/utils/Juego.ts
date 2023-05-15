// Clase Juego
export class Juego {
  nombre: string;
  descripcion: string;
  imagen: string;
  idJuego: number;
  precio: number;
  constructor(
    nombre: string,
    descripcion: string,
    imagen: string,
    idJuego: number,
    precio: number
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.idJuego = idJuego;
    this.precio = precio;
  }
}
