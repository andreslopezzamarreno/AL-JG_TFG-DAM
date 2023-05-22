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
  currentuser_gametag: string = '';
  usuario_amigo: Usuario | undefined;
  mostrarcarta: string = 'hidden';
  records_amigo: number[] = [];
  constructor(private database: DatabaseService, private auth: AuthService) {
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        this.currentuser_gametag = usuario.gametag;
        this.solicitudes = usuario.solicitudes;
        this.amigos = usuario.amigos;
      });
  }

  // Aceptar solicitud y añadar solicitante como amigo
  async Aceptar(gametag_solicitante: string) {
    this.Eliminar(gametag_solicitante);
    // Conseguir uid del gametag que ha enviado la solicitud
    await this.database
      .aniadirAmigo(this.auth.currentUser()!.uid, gametag_solicitante)
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
    this.database.userGametag(gametag_amigo).then((response) => {
      var usuario: Usuario = JSON.parse(response);
      this.usuario_amigo = usuario;
      this.records_amigo = this.usuario_amigo.records;
      console.log(this.records_amigo);
    });
  }

  async enviarSolicitud(gametag_solicitado: string) {
    var amigos: string[] = [];
    await this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        amigos = usuario.amigos;
      });

    if (gametag_solicitado != this.currentuser_gametag) {
      if (!amigos.includes(gametag_solicitado)) {
        console.log('no existe amigo ni es el mismo == nuevo amigo');

        this.database.obtenerSolicitudes(
          gametag_solicitado,
          this.currentuser_gametag
        );
      }
    }
  }
}
