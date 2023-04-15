import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Juego } from 'src/app/utils/Juego';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css'],
})
export class JuegosComponent {
  tipo: string = '';
  currentuser = this.auth.currentUser();
  todosLosJuegos: Juego[] = [];
  juegos: Juego[] = [];
  juegosRestantes: Juego[] = [];

  constructor(
    private database: DatabaseService,
    private actroute: ActivatedRoute,
    private auth: AuthService
  ) {
    actroute.params.subscribe((cosas) => {
      this.tipo = cosas['tipo'];
      console.log(this.tipo);
      this.verTodosLosJuegos();

      if (this.tipo == undefined) {
        this.tipo = 'misJuegos';
      }

      if (this.tipo == 'misJuegos') {
        this.juegosRestantes = [];
        this.verMisJuego(this.currentuser!.uid);
      } else {
        this.juegos = this.todosLosJuegos;
      }
    });
  }

  verMisJuego(uid: string) {
    this.juegos = [];
    this.juegosRestantes = [];
    this.database.verMisJuegos(uid).then((item) => {
      var contador = 0;
      item.forEach((element) => {
        element.data()['juegos'].forEach((element: any) => {
          contador++;
          if (element == true) {
            this.juegos.push(this.todosLosJuegos[contador]);
          } else {
            this.juegosRestantes.push(this.todosLosJuegos[contador]);
          }
        });
      });
    });
  }

  verTodosLosJuegos() {
    this.todosLosJuegos = [];
    this.database.verJuegos().then((item) => {
      item.forEach((element) => {
        var nombre = element.data()['nombre'];
        var descripcion = element.data()['descripcion'];
        var imagen = element.data()['imagen'];
        var juego = new Juego(nombre, descripcion, imagen);
        this.todosLosJuegos.push(juego);
      });
    });
  }
}
