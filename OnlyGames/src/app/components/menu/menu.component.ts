import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/usuario';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  currentUserGameTag?: string;
  currentUserCoins?: number;
  static currentUserCoins: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private database: DatabaseService
  ) {
    this.obtenerDatosUser();
  }
  // Obtener gametag del usuario que ha iniciado sesion
  obtenerDatosUser() {
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((response) => {
        var usuario: Usuario = JSON.parse(response);
        this.currentUserGameTag = usuario.gametag;
        this.currentUserCoins = usuario.coins;
      });
  }
  // Cerrar sesion
  cerrarSesion() {
    this.auth
      .logout()
      .then(() => {
        this.router.navigate(['/inicio/login']);
      })
      .catch((error) => console.log(error));
  }
}
