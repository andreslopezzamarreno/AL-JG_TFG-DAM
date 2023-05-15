import { Component, ViewChild } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-bubbleshoot',
  templateUrl: './bubbleshoot.component.html',
  styleUrls: ['./bubbleshoot.component.css'],
})
export class BubbleshootComponent {
  //id del juego para controlar bd
  IDJUEGO = 2;
  highScore = 0;

  @ViewChild('miSpan', { static: false }) miSpan: any;
  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.highScore = parseInt(
          localStorage.getItem('high-score_bubbleshoot')!
        );
        this.db.actualizarRecord(
          this.auth.currentUser()?.uid,
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
      .obtenerRecord(this.auth.currentUser()?.uid, this.IDJUEGO)
      .then((rec) => {
        this.highScore = rec;
        localStorage.setItem(
          'high-score_bubbleshoot',
          this.highScore.toString()
        );
        console.log(this.highScore);

        _CargarScripts.Carga('BubbleShoot/game');
      });
  }

  reiniciar() {
    this._CargarScripts.Carga('BubbleShoot/game');
  }
  ngOnDestroy(): void {
    this._CargarScripts.borrarScript();
  }
}
