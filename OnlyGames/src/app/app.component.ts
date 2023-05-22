import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

/*
          IMPORTANCIA
          1,5,7,8,9,10,4,2,3,6   documentacion   11


          "JUEGOS"
          1. monedas --> ver cuantas monedas da cada juegos por puntos

          "PREMIOS"
          2. Comprobar si el usuario tiene las monedas suficientes para canjear el premio

          3. Si es asi lo canjea y le envia email o le sale un alert con el codigo

          "EDITAR PERFIL"
          4. Que el usuario pueda cambiar su gametag
              - buscar paquete de iconos
              - que el usuario pueda comprar iconos
              - que pueda cambiarse la foto  (string de la ruta de la imagen, como los juegos)

          "BUGS"
          5. Cuando estoy con un juego y me voy a otros juegos --> detener la ejecucion del script si es que hay alguno ejecutandose, ejemplo, en el breakout le das a start e inmediatamente vas al menu, se sigue escuchando los sonidos del juego, como si estuvieses jugando aun

          6. Al iniciar sesion sigue apareciendo el mensaje de error como parpadeo y luego inicia sesion

          7. El el bublesbhoot solucionar lo del player.draw y lo de ball -> no se ni cuándo ni porque sale

          8. En el flappy bird cuando juegas, te sales del componente y vuelves al flappy va el doble de rapido
          9. En el snake tambien pasa lo de arriba

          10. Al enviar solicitud, ver que no puede enviarselo a si mismo y tampoco a un usuario que ya tiene como amigo

          "CONFIRMACION CORREO"
          11. Descomentar el codigo y dejarlo bien antes de entregarlo
    */
