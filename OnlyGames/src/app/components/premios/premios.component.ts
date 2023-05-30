import { Component } from '@angular/core';
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
      //recupero usuario para mostrar los premios que ya tiene
      var usuario: Usuario = JSON.parse(response);
      this.premios = usuario.premios;
    });
  }

  async canjearPremio() {
    this.code = '';
    this.code = this.generarCodigo();
    this.code = this.code.slice(0, -1);
    //comprar premio --> metodo de databaseService
    await this.db
      .comprarPremio(this.auth.currentUser()!.uid, this.code, 200000)
      .then((premios) => {
        //asigno a variable de clase
        this.premios = premios;
      });
  }

  generarCodigo() {
    //genera un didigo de 16 caracteres separados por - cada 4
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        this.code += characters.charAt(randomIndex);
      }
      this.code += '-';
    }
    return this.code;
  }
}
