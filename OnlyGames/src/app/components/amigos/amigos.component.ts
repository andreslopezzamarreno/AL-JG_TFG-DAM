import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/Usuario';
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
    //obtencion de usuario actual
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        //guardamos el gametag, las solicitudes y los amigos en variable
        this.currentuser_gametag = usuario.gametag;
        this.solicitudes = usuario.solicitudes;
        this.amigos = usuario.amigos;
        if (this.amigos.length == 0) {
          //mostrar mensaje de "no tienes amigo"
          this.mostrar = true;
        }
      });
  }

  aceptarSolicitud(gametag_solicitante: string) {
    this.mostrar = false;
    this.eliminarSolicitud(gametag_solicitante);
    // ejecucion aniadir amigo --> explicacion en databaseService
    this.database
      .aniadirAmigo(this.auth.currentUser()!.uid, gametag_solicitante)
      .then((amigos) => {
        //añade amigo a la base de datos y devuelve el array con los amigos actuales
        //se asignan a la varible
        this.amigos = amigos;
      });
  }

  eliminarSolicitud(gametag_solicitante: string) {
    this.database
      .eliminarSolicitudes(this.auth.currentUser()!.uid, gametag_solicitante)
      .then((rec) => {
        //elimina de la base de datos la solicitud y devuelve el array con las solicitudes actuales
        //se asignan a la varible
        this.solicitudes = rec;
      });
  }

  verEstadisticas(gametag_amigo: string) {
    // Ver estadisticas del amigo
    this.mostrarcarta = 'visible';
    //recuperar usuario a partir de gametag
    this.database.userGametag(gametag_amigo).then((response) => {
      var usuario: Usuario = JSON.parse(response);
      //asigno a varibale para mostrar las estadisticas del usuario recuperado
      this.usuario_amigo = usuario;
      this.records_amigo = this.usuario_amigo.records;
    });
  }

  async enviarSolicitud(gametag_solicitado: string) {
    var amigos: string[] = [];
    await this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        //recupero usuario a partir de uid (usuario actual)
        var usuario: Usuario = JSON.parse(user);
        //restriccion para que no se envie solicitud a si mismo
        if (usuario.gametag == gametag_solicitado) {
          //mostrar error con mensje y color concreto
          this.success = true;
          this.mensaje = 'No puedes enviarte solicitud a ti mismo';
          this.colorAlert = 'red';
          setTimeout(() => {
            //que se vaya automaricamente despues de 5 secs
            this.success = false;
          }, 5000);
          return;
        } else {
          //recuperar amigos del usuario para posteriormente comprobar que no hay repetidos
          amigos = usuario.amigos;
        }
      });

    //ver que no coincide solicitud con solicitante
    if (gametag_solicitado != this.currentuser_gametag) {
      //comprobar que solicitud no esta ya en amigos
      if (!amigos.includes(gametag_solicitado)) {
        this.database
          .obtenerSolicitudes(gametag_solicitado, this.currentuser_gametag)
          .then((rec) => {
            //recupero solicitudes --> explicacion en databaseService
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 5000);
            //muestro mensaje de exito o de fracaso
            if (rec) {
              //si el metodo devuelve true --> exito
              this.mensaje = 'Solicitud enviada';
              this.colorAlert = '#519c05';
            } else {
              //si false ->error
              this.mensaje = 'La solicitud no ha podido ser enviada';
              this.colorAlert = 'red';
            }
          });
      } else {
        this.success = true;
        setTimeout(() => {
          this.success = false;
        }, 5000);
        //muestro mensaje de exito o de fracaso
        this.mensaje = `Error,${gametag_solicitado} Ya es tu amigo`;
        this.colorAlert = 'red';
      }
    }
  }

  ocultarCarta() {
    this.mostrarcarta = 'hidden';
  }
}
