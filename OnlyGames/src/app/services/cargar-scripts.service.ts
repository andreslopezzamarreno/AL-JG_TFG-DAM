// Servicio para cargar los scripts de los juegos
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CargarScriptsService {
  constructor() {}

  // LLamar ruta con script de juego deseado
  Carga(archivo: string) {
    // Eliminar el script anterior, si lo hay
    let oldScript = document.querySelector('#mi-script');
    if (oldScript) {
      oldScript.remove();
    }

    // Crear un nuevo elemento <script> con el contenido del script
    let newScript = document.createElement('script');
    newScript.id = 'mi-script';
    newScript.src = './assets/' + archivo + '.js';
    //newScript.text = scriptContent;
    document.body.appendChild(newScript);
  }
}
