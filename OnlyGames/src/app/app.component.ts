import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

/*"JUEGOS"
   Sumar monedas por cada punto que consiga en los juegos, 1 punto = 1 moneda

  "AMIGOS"
   Y por cada amigo, saldra el elemento con el nombre de este, que si se pulsa saldra la tarjeta con sus estadisticas
  boton aceptar hace amigos para el current user pero tambien tiene que añadir amigo el otro al current user
  ¿como se hacen amigos?

   "PREMIOS"
    Comprobar si el usuario tiene las monedas suficientes para canjear el premio
    Si es asi lo canjea y le envia email o le sale un alert con el codigo

   "EDITAR PERFIL"
    Que el usuario pueda cambiar su gametag y que pueda alomejor cambiar su foto de perfil, donde habria varias fotos que pudiera elegir

    "OTROS"
    ¿Utilidad de los diamantes? ¿Por cada 100 monedas 1 diamante? y que los premios cuesten diamantes
    Hacer Documentacion

    "BUGS"
    cuando estoy con un juego y me voy a otros juegos --> detener la ejecucion del script si es que hay alguno
    ejecutandose, ejemplo, en el breakout le das a start e inmediatamente vas al menu, se sigue escuchando los
    sonidos del juego, como si estuvieses jugando aun, hay que quitar eso

    al iniciar sesion sigue apareciendo el mensaje de error como parpadeo y luego inicia sesion

    el el bublesbhoot solucionar lo del player.draw y lo de ball


    "CONFIRMACION CORREO"
    descomentar el codigo y dejarlo bien antes de entregarlo
    editar la plantilla para enviar un correo bien guapo
    */
