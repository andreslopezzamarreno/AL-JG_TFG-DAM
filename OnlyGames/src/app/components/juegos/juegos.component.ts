import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Juego } from 'src/app/utils/Juego';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/Usuario';

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
  mostrar = false;

  constructor(
    private db: DatabaseService,
    private actroute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    //ver si le esta llegando todosJuego o misJuegos
    actroute.params.subscribe((cosas) => {
      this.tipo = cosas['tipo'];
      this.todosLosJuegos = [];
      this.juegos = [];
      this.juegosRestantes = [];
      //relleno arrays de juegos, todosLosJuegos, juegosRestantes
      this.verTodosLosJuegos(this.currentuser!.uid);
      if (this.tipo == undefined) {
        this.tipo = 'misJuegos';
      }
      if (this.tipo == 'misJuegos') {
        this.todos = false;
      } else {
        this.todos = true;
        this.mostrar = false;
      }
    });
  }

  async verTodosLosJuegos(uid: string) {
    //relleno arrays de juegos, todosLosJuegos, juegosRestantes
    this.todosLosJuegos = [];
    //obtengo del databaseService los juegos
    await this.db.verJuegos().then((item) => {
      item.forEach((element) => {
        var nombre = element.data()['nombre'];
        var descripcion = element.data()['descripcion'];
        var imagen = element.data()['imagen'];
        var idJuego = element.data()['idJuego'];
        var precio = element.data()['precio'];
        //añado a array
        var juego = new Juego(nombre, descripcion, imagen, idJuego, precio);
        this.todosLosJuegos.push(juego);
      });
    });
    //obtengo usuario para ver que juegos puede jugar
    await this.db.recuperarUsuario(uid).then((user) => {
      var usuario: Usuario = JSON.parse(user);
      var contador = 0;
      usuario.juegos.forEach((juego) => {
        var juegoAct = this.todosLosJuegos[contador];
        contador++;
        if (juego == true) {
          //si puede jugar añado juego a "juegos"
          this.juegos.push(juegoAct);
        } else {
          //El resto que no puede van a restantes
          this.juegosRestantes.push(juegoAct);
        }
      });
    });
    if (this.juegos.length == 0 && !location.href.includes('todosJuegos')) {
      this.mostrar = true;
    }
  }

  irJuego(tipo: string) {
    // Ir a juego deseado
    this.router.navigate(['menu', tipo]);
  }

  comparJuego(idJuego: number, precioJuego: number) {
    //metodo -->databaseService
    this.db
      .comprarJuego(this.currentuser!.uid, idJuego, precioJuego)
      .then((data) => {
        if (data) {
          //cambio juego de array para que ya no este en restantes sino en misJuegos (juegos)
          this.juegosRestantes = this.juegosRestantes.filter(
            (game) => game != this.todosLosJuegos[idJuego]
          );
          this.mostrar = false;
          this.juegos.push(this.todosLosJuegos[idJuego]);
        }
      });
  }
}
