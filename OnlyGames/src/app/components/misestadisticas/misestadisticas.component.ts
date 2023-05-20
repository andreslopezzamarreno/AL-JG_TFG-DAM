import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/usuario';

@Component({
  selector: 'app-misestadisticas',
  templateUrl: './misestadisticas.component.html',
  styleUrls: ['./misestadisticas.component.css'],
})
export class MisestadisticasComponent {
  usuario: Usuario | undefined;

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
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((response) => {
        var usuario: Usuario = JSON.parse(response);
        this.usuario = usuario
      });
  }
}
