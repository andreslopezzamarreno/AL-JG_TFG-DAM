import { Component, HostListener, SimpleChanges } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
})
export class SnakeComponent {
  // Cargar script del juego
  constructor(private _CargarScripts: CargarScriptsService) {
    _CargarScripts.Carga(['Snake/game']);
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
      let highScore = localStorage.getItem('high-score_snake') || 0;
      console.log(highScore);
  }
}


