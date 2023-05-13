// Servicio para cargar los scripts de los juegos
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CargarScriptsService {
  constructor() {}

  script = document.createElement('script');

  // LLamar ruta con script de juego deseado
  Carga(archivo: string) {
    this.script.src = './assets/' + archivo + '.js';
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(this.script);
  }

  /*  borrarScript(archivo: string) {
    this.script.src = './assets/' + archivo + '.js';
    let body = document.getElementsByTagName('body')[0];
    console.log(body);

    body.removeChild(this.script);
    console.log(body);
  } */
}
