import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
  export class AmigosComponent {
    solicitudes: string[] = [];
    currentuser = this.auth.currentUser();
    constructor(
      private database: DatabaseService,
      private auth: AuthService
    ) {
      this.database
      .obtenerSolicitudes(this.auth.currentUser()?.uid)
      .then((rec) => {
        this.solicitudes = rec
      });

    }

    Aceptar(gametag_solicitante: string){
      // Conseguir uid del gametag que ha enviado la solicitud
      console.log(gametag_solicitante);
    }

    Eliminar(gametag_solicitante: string){
      // Eliminar la solicitud del array solicitudes
      this.database.eliminarSolicitudes(this.auth.currentUser()?.uid,gametag_solicitante)
      this.database
      .obtenerSolicitudes(this.auth.currentUser()?.uid)
      .then((rec) => {
        this.solicitudes = rec
      });
      location.replace
    }
  }

