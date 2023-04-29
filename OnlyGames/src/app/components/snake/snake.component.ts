import { Component, HostListener } from '@angular/core';
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
    this.cosas();
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }
  }

  /* @HostListener('window:storage')
  onStorageChange() {
    console.log('change...');
    console.log(localStorage.getItem('score'));
  } */

  cosas() {
    let highScore = localStorage.getItem('high-score') || 0;
    console.log(highScore);
  }
}

addEventListener('storage', (e) => {
  console.log('cambio registrado');
});
