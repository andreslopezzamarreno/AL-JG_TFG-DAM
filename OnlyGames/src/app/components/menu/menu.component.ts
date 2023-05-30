import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/Usuario';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  currentUserGameTag?: string;
  currentUserCoins?: number;

  constructor(
    private auth: AuthService,
    private router: Router,
    private database: DatabaseService
  ) {
    //obtengo gametag y monedas --> metodos databaseService
    this.database.asignarDatosMenu(this.auth.currentUser()!.uid);
  }

  ngOnInit() {
    //obtengo la variable gametag y las monedas de database service
    //se ha hecho de esta forma porque para actualizar la parte grafica desde diferentes sitios no encontramos otra
    this.database.getgametag.subscribe((value) => {
      this.currentUserGameTag = value;
    });
    this.database.getcoins.subscribe((value) => {
      this.currentUserCoins = value;
    });
  }

  cerrarSesion() {
    // Cerrar sesion -->metodo de authService
    this.auth
      .logout()
      .then(() => {
        this.router.navigate(['/inicio/login']);
      })
      .catch((error) => console.log(error));
  }
}
