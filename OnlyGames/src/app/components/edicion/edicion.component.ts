import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/usuario';

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrls: ['./edicion.component.css'],
})
export class EdicionComponent {
  currentUserGameTag?: string;
  editando = false;
  mensaje = '';
  mostrar = false;
  color = '';

  constructor(private auth: AuthService, private database: DatabaseService) {
    this.obtenerDatosUser();
  }
  // Obtener gametag del usuario que ha iniciado sesion
  obtenerDatosUser() {
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((response) => {
        var usuario: Usuario = JSON.parse(response);
        this.currentUserGameTag = usuario.gametag;
      });
  }

  habilitarEdicion() {
    var input = document.getElementById('input');
    input!.style.outline = '';
    input!.focus();
    this.editando = true;
  }

  async cambiarGameTag(texto: string) {
    if (texto != '') {
      try {
        this.database.userGametag(texto).then((response) => {
          if (response == '') {
            this.database.cambiarNombre(this.auth.currentUser()!.uid, texto);
            this.database.setgametag = texto;
            this.mostrarSuccess();
          } else {
            this.mostrarError('Ese gametag ya existe');
          }
        });
      } catch (error) {
        this.mostrarError('Error cambiando el gametag');
      }
    } else {
      this.mostrarError('El gametag no puede estar vacio');
    }
  }

  // Muestra el alert con el mensaje pasado
  mostrarError(mensaje: string) {
    this.mostrar = true;
    this.mensaje = mensaje;
    this.color = 'red';
    setTimeout(() => {
      this.mostrar = false;
    }, 5000);
  }
  // Muestra el alert con el mensaje pasado
  mostrarSuccess() {
    this.mostrar = true;
    this.color = '#519c05';
    this.mensaje = 'Gametag cambiado correctamente';
    setTimeout(() => {
      this.mostrar = false;
    }, 5000);
  }
}
