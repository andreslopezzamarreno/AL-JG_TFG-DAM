import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Juego } from 'src/app/utils/Juego';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/usuario';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css'],
})
export class JuegosComponent {
  tipo: string = '';
  currentuser = this.auth.currentUser();
  todos = false;
  todosLosJuegos: Juego[] = [];
  juegos: Juego[] = [];
  juegosRestantes: Juego[] = [];

  constructor(
    private db: DatabaseService,
    private actroute: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private menu: MenuComponent
  ) {
    actroute.params.subscribe((cosas) => {
      this.tipo = cosas['tipo'];
      this.todosLosJuegos = [];
      this.juegos = [];
      this.juegosRestantes = [];
      this.verTodosLosJuegos(this.currentuser!.uid);

      if (this.tipo == undefined) {
        this.tipo = 'misJuegos';
      }

      if (this.tipo == 'misJuegos') {
        this.todos = false;
      } else {
        this.todos = true;
      }
    });
  }

  // Ver todos los juegos
  async verTodosLosJuegos(uid: string) {
    this.todosLosJuegos = [];
    await this.db.verJuegos().then((item) => {
      item.forEach((element) => {
        var nombre = element.data()['nombre'];
        var descripcion = element.data()['descripcion'];
        var imagen = element.data()['imagen'];
        var idJuego = element.data()['idJuego'];
        var precio = element.data()['precio'];
        var juego = new Juego(nombre, descripcion, imagen, idJuego, precio);
        this.todosLosJuegos.push(juego);
      });
    });

    this.db.verMisJuegos(uid).then((item) => {
      var contador = 0;

      item.forEach((element) => {
        element.data()['juegos'].forEach((element: any) => {
          var juegoAct = this.todosLosJuegos[contador];
          contador++;
          if (element == true) {
            this.juegos.push(juegoAct);
          } else {
            this.juegosRestantes.push(juegoAct);
          }
        });
      });
    });
  }
  // Ir a juego deseado
  irJuego(tipo: string) {
    this.router.navigate(['menu', tipo]);
  }

  comparJuego(idJuego: number, precioJuego: number) {
    this.db
      .comprarJuego(this.currentuser!.uid, idJuego, precioJuego)
      .then((data) => {
        if (data) {
          console.log(this.todosLosJuegos[idJuego]);
          this.juegosRestantes = this.juegosRestantes.filter(
            (game) => game != this.todosLosJuegos[idJuego]
          );
          this.juegos.push(this.todosLosJuegos[idJuego]);
        }
      });
  }
}
