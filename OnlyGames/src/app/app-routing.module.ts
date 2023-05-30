import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { JuegosComponent } from './components/juegos/juegos.component';
import { FlappyBirdComponent } from './components/flappy-bird/flappy-bird.component';
import { SnakeComponent } from './components/snake/snake.component';
import { BreakoutComponent } from './components/breakout/breakout.component';
import { MisestadisticasComponent } from './components/misestadisticas/misestadisticas.component';
import { PremiosComponent } from './components/premios/premios.component';
import { BubbleshootComponent } from './components/bubbleshoot/bubbleshoot.component';
import { AmigosComponent } from './components/amigos/amigos.component';
import { EdicionComponent } from './components/edicion/edicion.component';

const routes: Routes = [
  { path: '', redirectTo: '/menu/Juegos/misJuegos', pathMatch: 'full' },
  //{ path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'inicio/:tipo', component: InicioComponent },
  {
    path: 'menu',
    component: MenuComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/inicio/login'])),
    children: [
      { path: 'Juegos/:tipo', component: JuegosComponent },
      { path: 'Flappy', component: FlappyBirdComponent },
      { path: 'Snake', component: SnakeComponent },
      { path: 'Breakout', component: BreakoutComponent },
      { path: 'BubbleShoot', component: BubbleshootComponent },
      { path: 'Premios', component: PremiosComponent },
      { path: 'Amigos', component: AmigosComponent },
      { path: 'MisEstadisticas', component: MisestadisticasComponent },
      { path: 'Edicion', component: EdicionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
