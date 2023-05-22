import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

/*
          IMPORTANTE
          1,9,10


          "JUEGOS"
          1. monedas --> ver cuantas monedas da cada juegos por puntos

          "PREMIOS"
          2. Comprobar si el usuario tiene las monedas suficientes para canjear el premio

          3. Si es asi lo canjea y le envia email o le sale un alert con el codigo

          "EDITAR PERFIL"
          4. Que el usuario pueda cambiar su gametag --> que pueda cambiar su foto de perfil, donde habria varias fotos que pudiera elegir

          "OTROS"
          5. Hacer Documentacion

          "BUGS"
          6. Cuando estoy con un juego y me voy a otros juegos --> detener la ejecucion del script si es que hay alguno ejecutandose, ejemplo, en el breakout le das a start e inmediatamente vas al menu, se sigue escuchando los sonidos del juego, como si estuvieses jugando aun

          7. Al iniciar sesion sigue apareciendo el mensaje de error como parpadeo y luego inicia sesion

          8. El el bublesbhoot solucionar lo del player.draw y lo de ball -> no se ni cuándo ni porque sale

          9. En el flappy bird cuando juegas, te sales del componente y vuelves al flappy va el doble de rapido
          10. En el snake tambien pasa lo de arriba

          11. Al enviar solicitud, ver que no puede enviarselo a si mismo y tampoco aun usuario que ya tiene como amigo

          "CONFIRMACION CORREO"
          12. Descomentar el codigo y dejarlo bien antes de entregarlo
    */
