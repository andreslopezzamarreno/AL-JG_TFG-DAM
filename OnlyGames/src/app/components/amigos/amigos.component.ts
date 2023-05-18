import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/usuario';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css'],
})
export class AmigosComponent {
  solicitudes: string[] = [];
  amigos: string[] = [];
  currentuser = this.auth.currentUser();
  uid_amigo: string = "";
  amigoGameTag?: string;
  amigoCoins?: number;
  amigoDiamantes?: number;
  mostrarcarta: string = "hidden"

  constructor(private database: DatabaseService, private auth: AuthService) {
    this.database
      .obtenerSolicitudes(this.auth.currentUser()?.uid)
      .then((rec) => {
        this.solicitudes = rec;
      });
    this.database
      .obtenerAmigos(this.auth.currentUser()?.uid)
      .then((rec) => {
        this.amigos = rec;
      });
  }
  // Aceptar solicitud y añadar solicitante como amigo
  Aceptar(gametag_solicitante: string) {
    // Conseguir uid del gametag que ha enviado la solicitud
    console.log(gametag_solicitante);
  }
  // Eliminar solicitud
  Eliminar(gametag_solicitante: string) {
      this.database
      .eliminarSolicitudes(this.auth.currentUser()?.uid,gametag_solicitante)
      .then((rec) => {
        this.solicitudes = rec
      });
  }

  // Ver estadisticas del amigo
  verEstadisticas(gametag_amigo: string){
    this.mostrarcarta = "visible"
    this.obtenerDatosAmigo()
  }

  obtenerDatosAmigo() {
    this.database
      .recuperarUsuario(this.uid_amigo)
      .then((response) => {
        var usuario: Usuario = JSON.parse(response);
        this.amigoGameTag = usuario.gametag;
        this.amigoCoins = usuario.coins;
        this.amigoDiamantes = usuario.diamantes;
      });
  }
}
