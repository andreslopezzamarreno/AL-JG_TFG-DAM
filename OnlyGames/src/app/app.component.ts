import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OnlyGames';
  ruta = ""
  constructor(private router: Router, private auth: AuthService) {
    this.ruta = window.location.href
  }
}

