import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  loguearse(usuario: string, pass: string) {
    this.auth
      .login(usuario, pass)
      .then((response) => {
        console.log(response);
        window.location.href="http://localhost:4200/menu"
      })
      .catch((error) => console.log(error));
  }

  onKeydown(event: any, usuario: string, pass: string) {
    if (event.key === "Enter") {
      this.loguearse(usuario,pass)
    }
  }
}
