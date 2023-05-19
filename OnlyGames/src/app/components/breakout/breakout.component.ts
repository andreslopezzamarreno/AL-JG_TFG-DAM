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
  IDJUEGO = 1;
  highScore = 0;

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
        this.highScore = rec;
        localStorage.setItem('high-score_breakout', this.highScore.toString());
        _CargarScripts.Carga('Breakout/game');
      });
  }

  reiniciar() {
    this._CargarScripts.Carga('Breakout/game');
  }

  ngOnDestroy(): void {
    this._CargarScripts.borrarScript();
  }
}
