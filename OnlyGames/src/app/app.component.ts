import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

/*"JUEGOS"
   Sumar monedas por cada punto que consiga en los juegos, 1 punto = 1 moneda
   Canjear juegos con monedas
   Quitar clasificacion

  "AMIGOS"
   Añadir arraylist SOLICITUDES y AMIGOS a los usuarios.
   Cada vez que se cargue esta pagina , como haciamos en los juegos se comprueba si existen solicitudes y amigos
   Por cada solicitud saldra el elemento solicitud, que si se da al boton aceptar, pasaras a tener ese amigo y si no se elimina la solicitud
   Y por cada amigo, saldra el elemento con el nombre de este, que si se pulsa saldra la tarjeta con sus estadisticas

   "RECORDS"
    Hacer como en el snake para todos los juegos
    Comprobar que las variables highscore del localstorage no coinciden entre juegos

   "PREMIOS"
    Comprobar si el usuario tiene las monedas suficientes para canjear el premio
    Si es asi lo canjea y le envia email o le sale un alert con el codigo

   "EDITAR PERFIL"
    Que el usuario pueda cambiar su gametag y que pueda alomejor cambiar su foto de perfil, donde habria varias fotos que pudiera elegir

    "OTROS"
    ¿Utilidad de los diamantes? ¿Por cada 100 monedas 1 diamante? y que los premios cuesten diamantes
    Hacer Documentacion*/
