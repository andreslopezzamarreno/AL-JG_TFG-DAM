import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css'],
})
export class JuegosComponent {
  constructor(private database: DatabaseService) {
    this.verJuegos;
  }

  verJuegos() {
    console.log(this.database.verJuegos());
  }
}
