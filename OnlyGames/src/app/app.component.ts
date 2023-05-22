import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

/*
          IMPORTANCIA
          5,6,7,1,2  documentacion 8


          "PREMIOS"
          1. Comprobar si el usuario tiene las monedas suficientes para canjear el premio

          2. Si es asi lo canjea y le envia email o le sale un alert con el codigo

          "EDITAR PERFIL"
          3. Que el usuario pueda cambiar su gametag -->que salga alert o algo que indique que se ha cambiado
              - buscar paquete de iconos
              - que el usuario pueda comprar iconos
              - que pueda cambiarse la foto  (string de la ruta de la imagen, como los juegos)

          "BUGS"
          4. Cuando estoy con un juego y me voy a otros juegos --> detener la ejecucion del script si es
 que hay alguno ejecutandose, ejemplo, en el breakout le das a start e inmediatamente vas al menu, se sigue escuchando los sonidos del juego, como si estuvieses jugando aun

          5. El el bublesbhoot solucionar lo del player.draw y lo de ball -> no se ni cuándo ni porque sale

          6. En el flappy bird cuando juegas, te sales del componente y vuelves al flappy va el doble de rapido
          7. En el snake tambien pasa lo de arriba

          "CONFIRMACION CORREO"
          8. Descomentar el codigo y dejarlo bien antes de entregarlo
    */
