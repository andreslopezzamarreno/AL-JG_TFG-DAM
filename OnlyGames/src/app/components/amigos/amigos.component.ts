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
  uid_amigo: string = '';
  amigoGameTag?: string;
  amigoCoins?: number;
  amigoDiamantes?: number;
  mostrarcarta: string = 'hidden';
  gametagCuerrentUser = '';
  constructor(private database: DatabaseService, private auth: AuthService) {
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        this.solicitudes = usuario.solicitudes;
        this.amigos = usuario.amigos;
      });
  }

  // Aceptar solicitud y añadar solicitante como amigo
  async Aceptar(gametag_solicitante: string) {
    this.Eliminar(gametag_solicitante);
    // Conseguir uid del gametag que ha enviado la solicitud
    await this.database
      .aniadirAmigo(this.auth.currentUser()!.uid, gametag_solicitante, true)
      .then((amigos) => {
        this.amigos = amigos;
      });
  }

  Eliminar(gametag_solicitante: string) {
    // Eliminar solicitud
    this.database
      .eliminarSolicitudes(this.auth.currentUser()!.uid, gametag_solicitante)
      .then((rec) => {
        this.solicitudes = rec;
      });
  }

  verEstadisticas(gametag_amigo: string) {
    // Ver estadisticas del amigo
    this.mostrarcarta = 'visible';
    this.obtenerDatosAmigo();
  }

  obtenerDatosAmigo() {
    this.database.recuperarUsuario(this.uid_amigo).then((response) => {
      var usuario: Usuario = JSON.parse(response);
      this.amigoGameTag = usuario.gametag;
      this.amigoCoins = usuario.coins;
      this.amigoDiamantes = usuario.diamantes;
    });
  }
}
