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
    this.error = false;
    //Para recuperar el tipo que se le pasa, si no hay tipo pasado inicia el login
    actroute.params.subscribe((cosas) => {
      this.tipo = cosas['tipo'];
      if (this.tipo == undefined) {
        this.tipo = 'login';
      }
    });
  }

  //metodo de login
  loguearse(usuario: string, pass: string) {
    if (usuario == '' || pass == '') {
      this.error = true;
      this.mensaje = 'Algun campo esta vacio';
    } else {
      this.auth
        .login(usuario, pass)
        .then((response) => {
          this.router.navigate(['/menu']);
        })
        .catch((error) => {
          this.error = true;
          this.mensaje =
            'Error al iniciar sesion. Asegurate de escribir bien correo y contraseña';
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

  //login con google
  googleLogin() {
    this.auth
      .loginWithGoogle()
      .then((response) => {
        this.router.navigate(['/menu']);
      })
      .catch((error) => {
        this.error = true;
        this.mensaje = 'Error al iniciar sesion.';
        console.log(error);
      });
  }

  //gesitro de usuario con usuario y contraseña añadiendo ademas gametag
  registro(usuario: string, pass: string) {
    var gametag = (<HTMLInputElement>document.getElementById('gametag')).value;
    if (usuario != '' && pass != '' && gametag != '') {
      this.database.existeGametag(gametag).then((response) => {
        if (response.size == 0) {
          this.auth
            .registro(usuario, pass)
            .then((response) => {
              this.database.escribirGameTag(response.user.uid, gametag);
              this.router.navigate(['/menu']);
            })
            .catch((error) => {
              this.error = true;
              this.mensaje = 'Error al registrarse';
              console.log(error);
            });
        } else {
          this.error = true;
          this.mensaje = 'Ya existe un usario con ese Gametag';
        }
      });
    } else {
      this.error = true;
      this.mensaje = 'Rellena todos los campos';
    }
  }

  //metodo para hacer el cambio entre login y registro
  navegar(tipo: string) {
    this.router.navigate(['inicio', tipo]);
  }
}
