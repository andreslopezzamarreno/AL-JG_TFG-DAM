import { Component, ViewChild } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-breakout',
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.css'],
})
export class BreakoutComponent {
  //id del juego para controlar bd
  IDJUEGO = 0;
  highScore = 0;

  ngOnInit(): void {
    window.addEventListener('message', this.handleScriptMessage.bind(this));
  }

  handleScriptMessage(event: MessageEvent): void {
    if (event.data && event.data.action === 'datosBreackout') {
      console.log('muere');
      const scriptData = event.data.data;

      this.db
        .aniadirMoneda(this.auth.currentUser()!.uid, scriptData.monedas)
        .then((coins) => {
          this.db.setcoins = coins;
        });
    }
  }

  @ViewChild('miSpan', { static: false }) miSpan: any;
  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.highScore = parseInt(localStorage.getItem('high-score_breakout')!);

        this.db.actualizarRecord(
          this.auth.currentUser()!.uid,
          this.highScore,
          this.IDJUEGO
        );
      });
    });
    observer.observe(this.miSpan.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  // Cargar script del juego
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
        localStorage.setItem('high-score_breakout', this.highScore.toString());
        //ejecuto script desde servicio --> explicacion ahi
        _CargarScripts.Carga('Breakout/game');
      });
  }

  ngOnDestroy(): void {
    //borrar scripts y reload
    this._CargarScripts.borrarScript();
    location.reload();
  }
}
