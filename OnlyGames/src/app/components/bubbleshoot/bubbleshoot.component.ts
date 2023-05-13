import { Component } from '@angular/core';
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
  // Cargar script del juego
  constructor(
    private _CargarScripts: CargarScriptsService,
    private db: DatabaseService,
    private auth: AuthService
  ) {
    _CargarScripts.Carga('BubbleShoot/game');
  }

  // Resetear juego
  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }
  }

  // Actualizar highscore
  ngOnDestroy(): void {
    let highScore = parseInt(localStorage.getItem('high-score_bubbleshoot')!);
    this.db.actualizarRecord(
      this.auth.currentUser()?.uid,
      highScore,
      this.IDJUEGO
    );
  }
}
