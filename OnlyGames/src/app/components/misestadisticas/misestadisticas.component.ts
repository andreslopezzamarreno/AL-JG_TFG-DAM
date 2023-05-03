import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/Usuario';

@Component({
  selector: 'app-misestadisticas',
  templateUrl: './misestadisticas.component.html',
  styleUrls: ['./misestadisticas.component.css']
})
export class MisestadisticasComponent {
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
        .recuperarGameTag(this.auth.currentUser()?.uid)
        .then((response) => {
          response.forEach((element: any) => {
            var usuario: Usuario = element.data();
            this.currentUserGameTag = usuario.gametag;
            this.currentUserCoins = usuario.coins;
            this.currentUserDiamantes = usuario.diamantes
          });
        });
    }
}
