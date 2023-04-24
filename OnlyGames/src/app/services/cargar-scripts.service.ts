import { Injectable } from '@angular/core';
import { reload } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor() { }

  Carga(archivos: string[]){
    for (let archivo of archivos) {
      let script = document.createElement("script")
      script.src = "./assets/" + archivo + ".js";
      let body = document.getElementsByTagName("body")[0];
      if (body.lastElementChild?.isEqualNode(script)) {
        body.removeChild(body.lastElementChild)
        body.appendChild(script);
        location.reload()
      } else {
        body.appendChild(script);
      }

    }
  }
}
