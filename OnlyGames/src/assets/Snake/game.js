// Inicializacion de elementos graficos
var playBoard = document.querySelector(".play-board");
var scoreElement = document.querySelector(".score");
var highScoreElement = document.querySelector(".high-score");
var controls = document.querySelectorAll(".controls i");

var gameOver = false;
var foodX, foodY;
var snakeX = 5,
  snakeY = 5;
var velocityX = 0,
  velocityY = 0;
var snakeBody = [];
var setIntervalId;
var score = 0;

// Cargar sonidos
var EAT = new Audio();
EAT.src = "./assets/Snake/fruit_sound.mp3";
var DEATH = new Audio();
DEATH.src = "./assets/Snake/videogame-death-sound-43894.mp3";
var START = new Audio();
START.src = "./assets/Snake/game-start-6104.mp3";

// TODO: Settear high score dependiendo de usuario
var highScore = localStorage.getItem("high-score_snake");
highScoreElement.innerText = `High Score: ${highScore}`;
START.play();

// Posicion de comida aleatoria
var updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

// Resetear pagina al morir
var handleGameOver = () => {
  DEATH.play();
  clearInterval(setIntervalId);
};

// Control de juego
var changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Cambiar direccion dependiendo click de flecha
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

var initGame = () => {
  if (gameOver) return handleGameOver();
  var html = `<div class="food" style="grid-area: ${foodY} / ${foodX}; background: #FF003D;"></div>`;

  // Comprobar si la snake ha llegado a la comida
  if (snakeX === foodX && snakeY === foodY) {
    EAT.play();
    updateFoodPosition();
    snakeBody.push([foodY, foodX]); // Aumentar tamaño snake al comer
    score++; // Aumentar score +1
    localStorage.setItem("score", score);
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score_snake", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }
  // Actualizar la snake con la velocidad
  snakeX += velocityX;
  snakeY += velocityY;

  // Desplazar valores de la snake
  for (var i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY]; // Mantener la posicion de la snake al aumentar el tamaño

  // Comprobar sila snake se ha chocado
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    DEATH.play();
    return (gameOver = true);
  }

  for (var i = 0; i < snakeBody.length; i++) {
    // Añadir div segun el tamaño de la snake
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background: #60CBFF"></div>`;
    // Comprobar si la snake se ha chocado con si misma
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
