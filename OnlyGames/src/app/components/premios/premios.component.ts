import { Component } from '@angular/core';
import { database } from 'firebase-admin';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/Usuario';
@Component({
  selector: 'app-premios',
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.css'],
})
export class PremiosComponent {
  code = '';
  premios: string[] = [];
  error = false;
  constructor(private auth: AuthService, private db: DatabaseService) {
    this.db.recuperarUsuario(this.auth.currentUser()!.uid).then((response) => {
      var usuario: Usuario = JSON.parse(response);
      this.premios = usuario.premios;
    });
  }

  async canjearPremio() {
    this.code = '';
    for (let i = 0; i < 4; i++) {
      this.generarCodigo();
    }
    this.code = this.code.slice(0, -1);

    await this.db.comprarPremio(
      this.auth.currentUser()!.uid,
      this.code,
      200000
    );

    this.db.recuperarUsuario(this.auth.currentUser()!.uid).then((response) => {
      var usuario: Usuario = JSON.parse(response);
      this.premios = usuario.premios;
    });
  }

  generarCodigo() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      this.code += characters.charAt(randomIndex);
    }
    return (this.code += '-');
  }

  sendEmail() {}
}
