import { Usuario } from './usuario';

export interface Juego {
  nombre: string;
  descripcion: string;
  clasificacion: Usuario[];
}
