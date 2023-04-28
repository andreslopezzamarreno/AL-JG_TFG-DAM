import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { JuegosComponent } from './components/juegos/juegos.component';
import { FlappyBirdComponent } from './components/flappy-bird/flappy-bird.component';
import { AjedrezComponent } from './components/ajedrez/ajedrez.component';
import { SnakeComponent } from './components/snake/snake.component';
import { BreakoutComponent } from './components/breakout/breakout.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'inicio/:tipo', component: InicioComponent },
  {
    path: 'menu',
    component: MenuComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/inicio/login'])),
    children: [
      { path: 'juegos/:tipo', component: JuegosComponent },
      { path: 'Flappy', component: FlappyBirdComponent },
      { path: 'Ajedrez', component: AjedrezComponent },
      { path: 'Snake', component: SnakeComponent },
      { path: 'Breakout', component: BreakoutComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
