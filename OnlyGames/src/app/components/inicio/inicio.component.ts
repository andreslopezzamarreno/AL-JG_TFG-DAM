import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/utils/usuario';
import { empty, isEmpty } from 'rxjs';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  tipo = '';
  error = false;
  mensaje = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private actroute: ActivatedRoute,
    private database: DatabaseService
  ) {
    //Para recuperar el tipo que se le pasa, si no hay tipo pasado inicia el login
    actroute.params.subscribe((cosas) => {
      this.error = false;
      this.tipo = cosas['tipo'];
      if (this.tipo == undefined) {
        this.tipo = 'login';
      }
    });
  }

  //metodo de login
  async loguearse(usuario: string, pass: string) {
    if (usuario == '' || pass == '') {
      this.mostrarError('Algun campo esta vacio');
    } else {
      await this.auth
        .login(usuario, pass)
        .then((response) => {
          this.router.navigate(['/menu']);
          var gametag = (<HTMLInputElement>document.getElementById('gametag'))
            .value;
          this.database.escribirGameTag(response.user.uid, gametag);
          //
        })
        .catch((error) => {
          this.mostrarError(
            'Error al iniciar sesion, Asegurate de escribir bien correo y contrasena'
          );
          console.log(error);
        });
    }
  }

  //control de las pulsaciondes del teclado
  onKeydown(event: any, usuario: string, pass: string) {
    if (event.key === 'Enter') {
      this.loguearse(usuario, pass);
    }
  }

  //regitro de usuario con usuario y contraseña añadiendo ademas gametag
  registro(usuario: string, pass: string) {
    var gametag = (<HTMLInputElement>document.getElementById('gametag')).value;
    if (usuario != '' && pass != '' && gametag != '') {
      this.database.existeGametag(gametag).then((response) => {
        if (response.size == 0) {
          if (pass.length < 6) {
            this.mostrarError(
              'La contrasena tiene que tener al menos 6 caracteres'
            );
          } else {
            this.auth
              .registro(usuario, pass)
              .then((response) => {
                this.database.escribirGameTag(response.user.uid, gametag);
                this.router.navigate(['/menu']);
              })
              .catch((error) => {
                console.log(error);
                this.mostrarError('Error al registrarse, el correo ya existe');
              });
          }
        } else {
          this.mostrarError('Ya existe un usario con ese Gametag');
        }
      });
    } else {
      this.mostrarError('Rellena todos los campos');
    }
  }

  //metodo para hacer el cambio entre login y registro
  navegar(tipo: string) {
    this.router.navigate(['inicio', tipo]);
  }

  //muestra el alert con el mensaje pasado
  mostrarError(mensaje: string) {
    this.error = true;
    this.mensaje = mensaje;
  }
}
