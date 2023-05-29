import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/usuario';
import { timeout } from 'rxjs';

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
  mostrar = false;
  success = false;
  mensaje = '';
  colorAlert = '';
  constructor(private database: DatabaseService, private auth: AuthService) {
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        this.currentuser_gametag = usuario.gametag;
        this.solicitudes = usuario.solicitudes;
        this.amigos = usuario.amigos;
        if (this.amigos.length == 0) {
          this.mostrar = true;
        }
      });
  }

  // Aceptar solicitud y añadar solicitante como amigo
  async Aceptar(gametag_solicitante: string) {
    this.mostrar = false;
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
    });
  }

  async enviarSolicitud(gametag_solicitado: string) {
    var amigos: string[] = [];
    await this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        if (usuario.gametag == gametag_solicitado) {
          this.success = true;
          this.mensaje = 'No puedes enviarte solicitud a ti mismo';
          this.colorAlert = 'red';
          setTimeout(() => {
            this.success = false;
          }, 5000);
          return;
        } else if (false) {
        } else {
          amigos = usuario.amigos;
        }
      });

    if (gametag_solicitado != this.currentuser_gametag) {
      if (!amigos.includes(gametag_solicitado)) {
        this.database
          .obtenerSolicitudes(gametag_solicitado, this.currentuser_gametag)
          .then((rec) => {
            console.log(rec);
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
            if (rec) {
              this.mensaje = 'Solicitud enviada';
              this.colorAlert = '#519c05';
            } else {
              this.mensaje = 'La solicitud no ha podido ser enviada';
              this.colorAlert = 'red';
            }
          });
      }
    }
  }

  ocultarCarta() {
    this.mostrarcarta = 'hidden';
  }
}
