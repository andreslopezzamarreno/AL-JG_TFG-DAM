import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { FirebaseAppModule } from '@angular/fire/app';

import { MenuComponent } from './components/menu/menu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { JuegosComponent } from './components/juegos/juegos.component';
import { FlappyBirdComponent } from './components/flappy-bird/flappy-bird.component';

import { CargarScriptsService } from './services/cargar-scripts.service';
import { SnakeComponent } from './components/snake/snake.component';
import { BreakoutComponent } from './components/breakout/breakout.component';
import { MisestadisticasComponent } from './components/misestadisticas/misestadisticas.component';
import { PremiosComponent } from './components/premios/premios.component';
import { BubbleshootComponent } from './components/bubbleshoot/bubbleshoot.component';
import { AmigosComponent } from './components/amigos/amigos.component';
import { EdicionComponent } from './components/edicion/edicion.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InicioComponent,
    JuegosComponent,
    FlappyBirdComponent,
    SnakeComponent,
    BreakoutComponent,
    MisestadisticasComponent,
    PremiosComponent,
    BubbleshootComponent,
    AmigosComponent,
    EdicionComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    HttpClientModule,
  ],
  providers: [CargarScriptsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
