import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}
  registro(usuario: string, pass: string) {
    this.auth
      .registro(usuario, pass)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
}
