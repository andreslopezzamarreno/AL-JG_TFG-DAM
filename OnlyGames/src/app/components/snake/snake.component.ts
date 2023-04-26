import { Component } from '@angular/core';
import { CargarScriptsService } from 'src/app/services/cargar-scripts.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
})
export class SnakeComponent {
  // Cargar script del juego
    constructor(private _CargarScripts: CargarScriptsService) {
      _CargarScripts.Carga(['Snake/game']);
    }

  // Resetear juego
  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }
  }


  /* //Inicializacion de elementos graficos
  playBoard = document.querySelector('.play-board');
  htmlplayBoard = this.playBoard?.innerHTML;
  scoreElement = document.querySelector('.score');
  highScoreElement = document.querySelector('.high-score');
  controls = document.querySelectorAll('.controls i');
  //const head = document.querySelectorAll(".head"); //esto sobra
  gameOver = false;
  foodX: number = 1;
  foodY: number = 1;
  snakeX: number = 5;
  snakeY: number = 5;
  velocityX = 0;
  velocityY = 0;
  snakeBody: Posicion[] = [];
  setIntervalId = null;
  score = 0;
  position: Posicion = new Posicion(1, 1);
  highScore: any;

  constructor() {
    this.initGame();
  }

  updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    this.foodX = Math.floor(Math.random() * 30) + 1;
    this.foodY = Math.floor(Math.random() * 30) + 1;
  };

  handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    //DEATH.play();
    //clearInterval(setIntervalId);
    alert('Game Over! Presiona Aceptar para volver a jugar...');
    location.reload();
  };

  initGame = () => {
    if (this.gameOver) return this.handleGameOver();
    let html = `<div class="food" style="grid-area: ${this.foodY} / ${this.foodX}; background: #FF003D;"></div>`;

    // Checking if the snake hit the food
    if (this.snakeX === this.foodX && this.snakeY === this.foodY) {
      //EAT.play();
      this.updateFoodPosition();
      this.position = new Posicion(this.foodY, this.foodX);
      this.snakeBody.push(this.position); // Pushing food position to snake body array
      this.score++; // increment score by 1
      this.highScore =
        this.score >= this.highScore ? this.score : this.highScore;
      localStorage.setItem('high-score', this.highScore);
      this.scoreElement!.innerHTML = `Score: ${this.score}`;
      this.highScoreElement!.innerHTML = `High Score: ${this.highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    this.snakeX += this.velocityX;
    this.snakeY += this.velocityY;

    // Shifting forward the values of the elements in the snake body by one
    for (let i = this.snakeBody.length - 1; i > 0; i--) {
      this.snakeBody[i] = this.snakeBody[i - 1];
    }
    this.snakeBody[0]['snakeX'] = this.snakeX  // Setting first element of snake body to current snake position
    this.snakeBody[0]['snakeY'] = this.snakeY // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if (
      this.snakeX <= 0 ||
      this.snakeX > 30 ||
      this.snakeY <= 0 ||
      this.snakeY > 30
    ) {
      //DEATH.play();
      return (this.gameOver = true);
    }

    for (let i = 0; i < this.snakeBody.length; i++) {
      // Adding a div for each part of the snake's body
      html += `<div class="head" style="grid-area: ${this.snakeBody[i]['snakeY']} / ${this.snakeBody[i]['snakeX']}; background: #60CBFF"></div>`;
      // Checking if the snake head hit the body, if so set gameOver to true
      if (
        i !== 0 &&
        this.snakeBody[0]['snakeY'] === this.snakeBody[i]['snakeY'] &&
        this.snakeBody[0]['snakeX'] === this.snakeBody[i]['snakeX']
      ) {
        this.gameOver = true;
      }
    }
    this.htmlplayBoard += html
    this.playBoard?.append(this.htmlplayBoard);
  };*/
}
