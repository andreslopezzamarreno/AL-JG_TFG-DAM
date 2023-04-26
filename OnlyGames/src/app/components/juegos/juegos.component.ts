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
  todos = false;
  todosLosJuegos: Juego[] = [];
  juegos: Juego[] = [];
  juegosRestantes: Juego[] = [];

  constructor(
    private database: DatabaseService,
    private actroute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    actroute.params.subscribe((cosas) => {
      this.tipo = cosas['tipo'];
      console.log(this.tipo);
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
    verTodosLosJuegos(uid: string) {
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

      this.database.verMisJuegos(uid).then((item) => {
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
      console.log(tipo);
      this.router.navigate(['menu', tipo]);
    }

}
