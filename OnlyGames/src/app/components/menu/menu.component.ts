import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  currentUserGameTag = ""
  constructor(private auth: AuthService, private router: Router) {
  }

  cerrarSesion() {
    this.auth
      .logout()
      .then(() => {
        this.router.navigate(['/inicio/login']);
      })
      .catch((error) => console.log(error));
  }
}
