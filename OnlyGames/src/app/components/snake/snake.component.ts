import {
  AfterViewInit,
  Component,
  ElementRef,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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

  ngOnInit(): void {
    window.addEventListener('message', this.handleScriptMessage.bind(this));
  }

  handleScriptMessage(event: MessageEvent): void {
    if (event.data && event.data.action === 'datosSnake') {
      console.log('muere');
      const scriptData = event.data.data;
      this.db
        .aniadirMoneda(this.auth.currentUser()!.uid, scriptData.monedas)
        .then((coins) => {
          console.log(coins);
          this.db.setcoins = coins;
        });
    }
  }

  @ViewChild('miSpan', { static: false }) miSpan: any;
  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.highScore = parseInt(localStorage.getItem('high-score_snake')!);
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
        this.highScore = rec;
        localStorage.setItem('high-score_snake', this.highScore.toString());
        _CargarScripts.Carga('Snake/game');
      });
  }

  reiniciar() {
    this._CargarScripts.Carga('Snake/game');
  }

  ngOnDestroy(): void {
    this._CargarScripts.borrarScript();
  }
}
