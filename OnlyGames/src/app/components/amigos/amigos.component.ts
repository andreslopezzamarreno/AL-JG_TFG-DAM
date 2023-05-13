import { Component } from '@angular/core';
import { Solicitud } from 'src/app/utils/Solicitud';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
  export class AmigosComponent {
    solicitudes: Solicitud[] = [];
    currentuser = this.auth.currentUser();
    constructor(
      private database: DatabaseService,
      private auth: AuthService
    ) {

  }
}

