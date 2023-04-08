import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  tipo = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private Actroute: ActivatedRoute
  ) {
    Actroute.params.subscribe((cosas) => {
      this.tipo = cosas['tipo'];
      if (this.tipo == undefined) {
        this.tipo = 'login';
      }
    });
  }

  loguearse(usuario: string, pass: string) {
    this.auth
      .login(usuario, pass)
      .then((response) => {
        console.log(response);
        this.router.navigate(['/menu']);
      })
      .catch((error) => console.log(error));
  }

  onKeydown(event: any, usuario: string, pass: string) {
    if (event.key === 'Enter') {
      this.loguearse(usuario, pass);
    }
  }

  googleLogin() {
    this.auth
      .loginWithGoogle()
      .then((response) => {
        this.router.navigate(['/menu']);
      })
      .catch((error) => console.log(error));
  }

  registro(usuario: string, pass: string) {
    this.auth
      .registro(usuario, pass)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  navegar(tipo: string) {
    this.router.navigate(['inicio', tipo]);
  }
}
