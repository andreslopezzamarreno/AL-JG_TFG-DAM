import { Component } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/utils/Usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flappy-bird',
  templateUrl: './flappy-bird.component.html',
  styleUrls: ['./flappy-bird.component.css'],
})
export class FlappyBirdComponent {
  //id del juego para controlar bd
  IDJUEGO = 2;
  highScore = 0;
  desbloqueado = false;
  constructor(
    private _CargarScripts: CargarScriptsService,
    private db: DatabaseService,
    private auth: AuthService,
    private router: Router
  ) {
    this.inicio();
  }

  async inicio() {
    //metodo para restringir si el usuario puede o no juegar al juego
    await this.db
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((user) => {
        var usuario: Usuario = JSON.parse(user);
        if (usuario.juegos[this.IDJUEGO]) {
          this.desbloqueado = true;
        }
      });
    //si no puede redirige a mis juegos
    if (!this.desbloqueado) {
      this.router.navigate(['menu/Juegos', 'misJuegos']);
    } else {
      this.db
        .obtenerRecord(this.auth.currentUser()!.uid, this.IDJUEGO)
        .then((rec) => {
          //recupero el record de la base de datos
          this.highScore = rec;
          //asigno record a la variable del localHost para que la lea el script
          localStorage.setItem('high-score_flappy', this.highScore.toString());
          //ejecuto script desde servicio --> explicacion en cargar-scriptService
          this._CargarScripts.carga('FlappyBird/game');
        });
    }
  }

  ngOnInit(): void {
    //inicializacion del escuchador del mensaje
    window.addEventListener('message', this.handleScriptMessage.bind(this));
  }

  //recojo el mensaje enviado desde assets/FlappyBird/game.js
  handleScriptMessage(event: MessageEvent): void {
    if (event.data && event.data.action === 'datosFlappy') {
      const scriptData = event.data.data;
      //actualizo si ha habido record
      this.db.actualizarRecord(
        this.auth.currentUser()!.uid,
        parseInt(scriptData.record),
        this.IDJUEGO
      );
      //actualizo monedas ganadas en la partida
      this.db
        .aniadirMoneda(this.auth.currentUser()!.uid, scriptData.monedas)
        .then((coins) => {
          this.db.setcoins = coins;
        });
    }
  }

  ngOnDestroy(): void {
    //borrar scripts y reload
    this._CargarScripts.borrarScript();
    location.reload();
  }
}
