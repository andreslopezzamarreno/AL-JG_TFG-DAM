// Servicio para cargar los scripts de los juegos
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CargarScriptsService {
  constructor() {}
  // LLamar ruta con script de juego deseado
  Carga(archivo: string) {
    console.log(archivo);

    let script = document.createElement('script');
    script.src = './assets/' + archivo + '.js';
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(script);

    console.log(body);

    /* for (let archivo of archivos) {
      let script = document.createElement('script');
      script.src = './assets/' + archivo + '.js';
      //script.type = 'module';
      let body = document.getElementsByTagName('body')[0];
      body.appendChild(script);
    } */
  }
}
