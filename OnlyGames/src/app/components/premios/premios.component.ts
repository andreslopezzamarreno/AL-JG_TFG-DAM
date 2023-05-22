import { Component } from '@angular/core';
@Component({
  selector: 'app-premios',
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.css']
})
export class PremiosComponent {
  code = "";

  canjearPremio(){
    this.code = ""
    for (let i = 0; i < 4; i++) {
      this.generarCodigo()
    }
    alert("Tu codigo es: " + this.code.slice(0, -1))
  }

  generarCodigo(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      this.code += characters.charAt(randomIndex);
    }
    return this.code += "-"
  }
}

