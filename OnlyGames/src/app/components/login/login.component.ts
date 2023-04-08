import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  loggedIn = false
  constructor(private auth: AuthService,private router: Router) {}

  loguearse(usuario: string, pass: string) {
    this.auth
      .login(usuario, pass)
      .then((response) => {
        console.log(response);
        this.router.navigate(['/menu'])
      })
      .catch((error) => console.log(error));
  }

  onKeydown(event: any, usuario: string, pass: string) {
    if (event.key === "Enter") {
      this.loguearse(usuario,pass)
    }
  }

  googleLogin(){
    this.auth.loginWithGoogle()
    .then(response => {
      this.router.navigate(['/menu'])
    })
    .catch(error => console.log(error))
  }
}
