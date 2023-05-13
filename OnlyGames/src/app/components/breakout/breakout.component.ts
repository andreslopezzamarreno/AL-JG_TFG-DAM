import { Component } from '@angular/core';
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
  // Cargar script del juego
  constructor(
    private _CargarScripts: CargarScriptsService,
    private db: DatabaseService,
    private auth: AuthService
  ) {
    _CargarScripts.Carga('Breakout/game');
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
  // TODO: cuando un usuario registre un record, se guara en bbdd del currentuser, u cada vez que se inicie
  // un juego el high-score del local storage se settea con el valor del record en bbdd
  ngOnDestroy(): void {
    let highScore = parseInt(localStorage.getItem('high-score_breakout')!);
    this.db.actualizarRecord(
      this.auth.currentUser()?.uid,
      highScore,
      this.IDJUEGO
    );
  }
}
