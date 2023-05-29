import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    this.database.asignarDatos(this.auth.currentUser()!.uid);
  }

  ngOnInit() {
    this.database.getgametag.subscribe((value) => {
      this.currentUserGameTag = value;
      // Aquí puedes realizar cualquier acción que desees cuando la variable cambie
    });
    this.database.getcoins.subscribe((value) => {
      this.currentUserCoins = value;
      // Aquí puedes realizar cualquier acción que desees cuando la variable cambie
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
