import { Component } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';

@Component({
  selector: 'app-bubbleshoot',
  templateUrl: './bubbleshoot.component.html',
  styleUrls: ['./bubbleshoot.component.css']
})
export class BubbleshootComponent {
  // Cargar script del juego
  constructor(private _CargarScripts: CargarScriptsService) {
    _CargarScripts.Carga(['BubbleShoot/game']);
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
}
