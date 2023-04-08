import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private auth: AuthService, private router: Router) {
    var currentUser = auth.currentUser();
    console.log(currentUser);
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
