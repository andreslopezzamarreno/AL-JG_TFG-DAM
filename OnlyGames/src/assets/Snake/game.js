// Inicializacion de elementos graficos
var playBoard = document.querySelector(".play-board");
var scoreElement = document.querySelector(".score");
var highScoreElement = document.querySelector(".high-score");
var controls = document.querySelectorAll(".controls i");
var btnStart = document.getElementById("btnplay");

//inicializacion de varibles
var gameOver = false;
var foodX, foodY;
var snakeX = Math.floor(Math.random() * 30) + 1,
  snakeY = Math.floor(Math.random() * 30) + 1;
var velocityX = 0,
  velocityY = 0;
var snakeBody = [];
var setIntervalId;
var score = 0;

// Cargar sonidos
var EAT = new Audio("./assets/Snake/fruit_sound.mp3");
var DEATH = new Audio("./assets/Snake/videogame-death-sound-43894.mp3");
var START = new Audio("./assets/Snake/game-start-6104.mp3");

var highScore = localStorage.getItem("high-score_snake");
highScoreElement.innerText = `High Score: ${highScore}`;
START.play();

btnStart.addEventListener("click", function (evt) {
  score = 0;
  scoreElement.innerText = `Score: ${score}`;
  clearInterval(setIntervalId);
});

var updateFoodPosition = () => {
  // Posicion de comida aleatoria
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

var cambioPuntos = (puntos) => {
  //El rotorno es el numero de monedas que gana
  return puntos * 6;
};

var handleGameOver = () => {};

var changeDirection = (e) => {
  // Control de juego
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

var initGame = () => {
  if (gameOver) return handleGameOver();
  var html = `<div class="food" style="grid-area: ${foodY} / ${foodX}; background: #FF003D;"></div>`;

  // Comprobar si el snake ha llegado a la comida
  if (snakeX === foodX && snakeY === foodY) {
    EAT.play();
    //cambia la posicion de la comida
    updateFoodPosition();
    snakeBody.push([foodY, foodX]); // Aumentar tamaño snake al comer
    score++; // Aumentar score +1
    //comprobacion para ver si el score supera highScore
    highScore = score >= highScore ? score : highScore;
    //seteo para mantener consistencia
    localStorage.setItem("high-score_snake", highScore);
    //ponerlo graficamente
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

  // Comprobar si el snake se ha chocado
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    DEATH.play();
    var numMonedas = cambioPuntos(score);
    //envia mensaje el window para que el escuchador del componente del snake
    //las monedas y las ponga en la base de datos
    window.postMessage(
      {
        action: "datosSnake",
        data: {
          monedas: numMonedas,
          record: highScore,
        },
      },
      "*"
    );
    return (gameOver = true);
  }

  for (var i = 0; i < snakeBody.length; i++) {
    // Añadir div segun el tamaño de la snake
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background: #60CBFF"></div>`;
    // Comprobar si la snake se ha chocado con sigo misma
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
      var numMonedas = cambioPuntos(score);
      //envia mensaje el window para que el escuchador del componente del snake
      //las monedas y las ponga en la base de datos
      window.postMessage(
        {
          action: "datosSnake",
          data: {
            monedas: numMonedas,
            record: highScore,
          },
        },
        "*"
      );
    }
  }
  playBoard.innerHTML = html;
};

//actualiza comida
updateFoodPosition();
//juego en si, cada 100 milisegundos se ejecuta initGame
setIntervalId = setInterval(initGame, 100);
//escuchador de las flechas
document.addEventListener("keyup", changeDirection);
