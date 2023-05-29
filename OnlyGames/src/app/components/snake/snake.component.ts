import { Component, ViewChild } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
})
export class SnakeComponent {
  //id del juego para controlar db
  IDJUEGO = 3;
  highScore = 0;

  constructor(
    private _CargarScripts: CargarScriptsService,
    private db: DatabaseService,
    private auth: AuthService
  ) {
    this.db
      .obtenerRecord(this.auth.currentUser()!.uid, this.IDJUEGO)
      .then((rec) => {
        //recupero el record de la base de datos
        this.highScore = rec;
        //asigno record a la variable del localHost para que la lea el script
        localStorage.setItem('high-score_snake', this.highScore.toString());
        //ejecuto script desde servicio --> explicacion en cargar-scriptService
        _CargarScripts.carga('Snake/game');
      });
  }

  ngOnInit(): void {
    //inicializacion del escuchador del mensaje
    window.addEventListener('message', this.handleScriptMessage.bind(this));
  }

  //recojo el mensaje enviado desde assets/Snake/game.js
  handleScriptMessage(event: MessageEvent): void {
    if (event.data && event.data.action === 'datosSnake') {
      console.log('muere');
      const scriptData = event.data.data;
      //actualizo monedas ganadas en la partida
      this.db
        .aniadirMoneda(this.auth.currentUser()!.uid, scriptData.monedas)
        .then((coins) => {
          this.db.setcoins = coins;
        });
    }
  }

  //escucho el cambio del high-score y al cambiar actualizo la base de datos
  //El cambio se produce en assets/breakout/game.js
  @ViewChild('miSpan', { static: false }) miSpan: any;
  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      this.highScore = parseInt(localStorage.getItem('high-score_snake')!);
      this.db.actualizarRecord(
        this.auth.currentUser()!.uid,
        this.highScore,
        this.IDJUEGO
      );
    });
    //detecto cambio
    observer.observe(this.miSpan.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  reiniciar() {
    //carga de nuevo el script
    this._CargarScripts.carga('Snake/game');
  }

  ngOnDestroy(): void {
    //borrar scripts y reload
    this._CargarScripts.borrarScript();
    location.reload();
  }
}
