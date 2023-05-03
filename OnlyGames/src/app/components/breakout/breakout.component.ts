import { Component } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';

@Component({
  selector: 'app-breakout',
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.css']
})
export class BreakoutComponent {

  // Cargar script del juego
  constructor( private _CargarScripts: CargarScriptsService){
    _CargarScripts.Carga(["Breakout/game"]);
  }

  // Resetear juego
  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
  }

  // Actualizar highscore
  // TODO: cuando un usuario registre un record, se guara en bbdd del currentuser, u cada vez que se inicie
  // un juego el high-score del local storage se settea con el valor del record en bbdd
  ngOnDestroy(): void {
    let highScore = localStorage.getItem('high-score') || 0;
    console.log(highScore);
}

}
