import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/utils/usuario';
@Component({
  selector: 'app-premios',
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.css'],
})
export class PremiosComponent {
  code = '';

  constructor(private auth: AuthService, private db: DatabaseService) {}

  async canjearPremio() {
    this.code = '';
    for (let i = 0; i < 4; i++) {
      this.generarCodigo();
    }

    await this.db.comprarPremio(
      this.auth.currentUser()!.uid,
      this.code,
      200000
    );
  }

  generarCodigo() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      this.code += characters.charAt(randomIndex);
    }
    return (this.code += '-');
  }
}
