import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OnlyGames';
  ruta = ""
  constructor(private router: Router ) {
    this.ruta = window.location.href
  }

  click_opc(){
    this.ruta = window.location.href
  }

}

