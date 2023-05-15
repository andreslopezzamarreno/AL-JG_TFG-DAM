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
  currentUserDiamantes?: number;

  constructor(
    private auth: AuthService,
    private router: Router,
    private database: DatabaseService,
    private actroute: ActivatedRoute
  ) {
    this.obtenerDatosUser();
  }
  // Obtener gametag del usuario que ha iniciado sesion
  obtenerDatosUser() {
    this.database
      .recuperarUsuario(this.auth.currentUser()?.uid)
      .then((response) => {
        response.forEach((element: any) => {
          var usuario: Usuario = element.data();
          this.currentUserGameTag = usuario.gametag;
          this.currentUserCoins = usuario.coins;
          this.currentUserDiamantes = usuario.diamantes;
        });
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
