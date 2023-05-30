import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/Usuario';

@Component({
  selector: 'app-misestadisticas',
  templateUrl: './misestadisticas.component.html',
  styleUrls: ['./misestadisticas.component.css'],
})
export class MisestadisticasComponent {
  usuario: Usuario | undefined;

  constructor(private auth: AuthService, private database: DatabaseService) {
    //obtengo el usuario para mostrar en el html sus estadisticas
    this.database
      .recuperarUsuario(this.auth.currentUser()!.uid)
      .then((response) => {
        var usuario: Usuario = JSON.parse(response);
        this.usuario = usuario;
      });
  }
}
