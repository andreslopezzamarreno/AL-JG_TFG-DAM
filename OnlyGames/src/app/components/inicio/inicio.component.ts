import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  tipo = '';
  error = false;
  mensaje = '';
  color = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private actroute: ActivatedRoute,
    private database: DatabaseService
  ) {
    // Para recuperar el tipo que se le pasa, si no hay tipo pasado inicia el login
    actroute.params.subscribe((cosas) => {
      this.error = false;
      this.tipo = cosas['tipo'];
      if (this.tipo == undefined) {
        this.tipo = 'login';
      }
    });
  }

  async loguearse(usuario: string, pass: string) {
    // Metodo de login
    if (usuario == '' || pass == '') {
      //si hay algun input vacio
      this.color = 'red';
      this.mostrarError('Algun campo esta vacio');
    } else {
      //si ambos estan llenos
      //metodo authService
      await this.auth
        .login(usuario, pass)
        .then((user) => {
          //comprobar si el mail ha sido verificado
          if (user.user.emailVerified) {
            this.router.navigate(['/menu/Juegos/misJuegos']);
          } else {
            this.color = 'red';
            this.mostrarError('El correo no ha sido verificado');
          }
        })
        .catch((error) => {
          this.color = 'red';
          this.mostrarError(
            'Error al iniciar sesion, Asegurate de escribir bien correo y contrasena'
          );
          console.log(error);
        });
    }
  }

  onKeydown(event: any, usuario: string, pass: string) {
    // Control de las pulsaciondes del teclado
    if (event.key === 'Enter') {
      if (
        location.href.includes('login') ||
        location.href == 'http://localhost:4200/'
      ) {
        this.loguearse(usuario, pass);
      } else {
        this.registro(usuario, pass);
      }
    }
  }

  async registro(usuario: string, pass: string): Promise<void> {
    // Regitro de usuario con usuario y contraseña añadiendo ademas gametag
    var gametag = (<HTMLInputElement>document.getElementById('gametag')).value;
    //comprobar que ningun campo esta vacio
    if (usuario != '' && pass != '' && gametag != '') {
      //re para el correo
      var regExp = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/;
      if (!regExp.test(usuario)) {
        this.color = 'red';
        this.mostrarError(`Introduce correctamente el correo`);
      } else {
        //re para la contraseñ
        var regExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (!regExp.test(pass)) {
          this.color = 'red';
          this.mostrarError(
            `La contrasena es poco segura. Al menos 6 caracteres usando numeros y letras.`
          );
        } else {
          //recupero gametag a ver si existe
          await this.database.userGametag(gametag).then(async (response) => {
            if (response == '') {
              //si no existe hago el registro
              await this.auth
                .registro(usuario, pass)
                .then((response) => {
                  if (response.user) {
                    //emvia correo de verificacion si es correcto
                    sendEmailVerification(response.user).then(() => {
                      //añado los datos del usuario a la base de datos
                      this.database.registrarUsuario(
                        response.user.uid,
                        gametag
                      );
                      //mensaje de exito
                      this.color = '#519c05';
                      this.mostrarError(
                        `Te hemos enviado un correo a ${usuario} para verificar el email`
                      );
                    });
                  }
                })
                .catch((error) => {
                  this.color = 'red';
                  this.mostrarError(
                    'Error al registrarse, el correo ya existe'
                  );
                });
            } else {
              this.color = 'red';
              this.mostrarError('Ya existe un usario con ese Gametag');
            }
          });
        }
      }
    } else {
      this.color = 'red';
      this.mostrarError('Rellena todos los campos');
    }
  }

  navegar(tipo: string) {
    // Metodo para hacer el cambio entre login y registro
    this.router.navigate(['inicio', tipo]);
  }

  mostrarError(mensaje: string) {
    // Muestra el alert con el mensaje pasado
    this.error = true;
    this.mensaje = mensaje;
  }
}
