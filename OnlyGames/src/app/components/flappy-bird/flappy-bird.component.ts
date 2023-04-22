import { Component } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';

@Component({
  selector: 'app-flappy-bird',
  templateUrl: './flappy-bird.component.html',
  styleUrls: ['./flappy-bird.component.css']
})
export class FlappyBirdComponent {
    constructor( private _CargarScripts: CargarScriptsService){
      _CargarScripts.Carga(["FlappyBird/game"]);
    }
}
