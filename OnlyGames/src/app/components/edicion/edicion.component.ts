import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/Usuario';

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
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((response) => {
        // Obtener gametag del usuario que ha iniciado sesion
        var usuario: Usuario = JSON.parse(response);
        this.currentUserGameTag = usuario.gametag;
      });
  }

  habilitarEdicion() {
    //habilito posibilidad de cambiar gametag
    var input = document.getElementById('input');
    input!.style.outline = '';
    input!.focus();
    this.editando = true;
  }

  async cambiarGameTag(texto: string) {
    //comprobacion que input no esta vacio
    if (texto != '') {
      try {
        //busco un usuario por ese gametag
        this.database.userGametag(texto).then((response) => {
          //si no existe, es posible cambiarlo
          if (response == '') {
            //cambio de gametag --> explicacion en databaseService
            this.database.cambiarNombre(this.auth.currentUser()!.uid, texto);
            //actualizacion grafica del gametag
            this.database.setgametag = texto;
            //muestro alert de exito
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

  mostrarError(mensaje: string) {
    // Muestra el alert con el mensaje pasado de error
    this.mostrar = true;
    this.mensaje = mensaje;
    this.color = 'red';
    setTimeout(() => {
      this.mostrar = false;
    }, 5000);
  }

  mostrarSuccess() {
    // Muestra el alert con el mensaje pasado de exito
    this.mostrar = true;
    this.color = '#519c05';
    this.mensaje = 'Gametag cambiado correctamente';
    setTimeout(() => {
      this.mostrar = false;
    }, 5000);
  }
}
