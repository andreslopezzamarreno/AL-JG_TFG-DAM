// Servicio para cargar los scripts de los juegos
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CargarScriptsService {
  constructor() {}

  private newScript: HTMLScriptElement | null = null;
  // LLamar ruta con script de juego deseado
  Carga(script: string) {
    // Eliminar el script anterior, si lo hay
    let oldScript = document.querySelector('#mi-script');
    if (oldScript) {
      oldScript.remove();
    }

    // Crear un nuevo elemento <script> con el contenido del script
    this.newScript = document.createElement('script');
    this.newScript.id = 'mi-script';
    this.newScript.src = './assets/' + script + '.js';
    //newScript.text = scriptContent;
    document.body.appendChild(this.newScript);
  }

  borrarScript() {
    if (this.newScript) {
      document.body.removeChild(this.newScript);
      this.newScript = null;
    }
  }
}
