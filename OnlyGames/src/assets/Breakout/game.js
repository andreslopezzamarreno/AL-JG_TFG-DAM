// Seleccionar canvas e inicializar elementos
var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");
var highScoreElement = document.querySelector(".high-score");
var scoreElement = document.querySelector(".score");
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

var highScore = parseInt(localStorage.getItem("high-score_breakout")) || 0;

var game = {
  requestId: null,
  timeoutId: null,
  leftKey: false,
  rightKey: false,
  on: false,
  sfx: true,
};

game.highScore = highScore;

var paddle = {
  height: 20,
  width: 100,
  get y() {
    return canvas.height - this.height;
  },
};
var ball = {
  radius: 10,
};
var brick = {
  rows: 5,
  cols: 10,
  get width() {
    return canvas.width / this.cols;
  },
  height: 30,
};
var images = {
  background: new Image(),
  ball: new Image(),
  paddle: new Image(),
};
// Pantalla de inicio
function onImageLoad(e) {
  resetGame();
  initBricks();
  resetPaddle();
  paint();
  ctx.font = "50px ArcadeClassic";
  ctx.fillStyle = "lime";
  ctx.fillText("PRESS START", canvas.width / 2 - 140, canvas.height / 2);
}
images.background.addEventListener("load", onImageLoad);
images.background.src = "./assets/Breakout/bg-space.webp";
images.ball.src = "./assets/Breakout/ball.webp";
images.paddle.src = "./assets/Breakout/paddle.webp";

var sounds = {
  ballLost: new Audio("./assets/Breakout/ball-lost.mp3"),
  breakout: new Audio("./assets/Breakout/breakout.mp3"),
  brick: new Audio("./assets/Breakout/brick.mp3"),
  levelCompleted: new Audio("./assets/Breakout/level-completed.mp3"),
};

var brickField = [];

// Empezar juego
function play() {
  cancelAnimationFrame(game.requestId);
  clearTimeout(game.timeoutId);
  game.on = true;

  resetGame();
  resetBall();
  resetPaddle();
  initBricks();

  game.sfx && sounds.breakout.play();

  animate();
}

// Resetear juego
function resetGame() {
  game.speed = 7;
  game.score = 0;
  game.level = 1;
  game.lives = 3;
  game.time = { start: performance.now(), elapsed: 0, refreshRate: 16 };
}

// Inicializar sonidos
function initSounds() {
  for (const [key] of Object.entries(sounds)) {
    sounds[key].volume = 0.5;
  }
}

// Manejo de pelota
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - paddle.height - 2 * ball.radius;
  ball.dx = game.speed * (Math.random() * 2 - 1); // Trayectoria aleatoria
  ball.dy = -game.speed; // Velocidad
}

// Resetear paleta
function resetPaddle() {
  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.dx = game.speed + 7;
}

// Inicializar ladrillos
function initBricks() {
  brickField = [];
  const topMargin = 30;
  const colors = ["red", "orange", "yellow", "blue", "green"];

  for (let row = 0; row < brick.rows; row++) {
    for (let col = 0; col < brick.cols; col++) {
      brickField.push({
        x: col * brick.width,
        y: row * brick.height + topMargin,
        height: brick.height,
        width: brick.width,
        color: colors[row],
        points: (5 - row) * 2,
        hitsLeft: row === 0 ? 2 : 1,
      });
    }
  }
}

// Animaciones
function animate(now = 0) {
  game.time.elapsed = now - game.time.start;
  if (game.time.elapsed > game.time.refreshRate) {
    game.time.start = now;

    paint();
    update();
    detectCollision();
    detectBrickCollision();

    if (isLevelCompleted() || isGameOver()) return;
  }

  game.requestId = requestAnimationFrame(animate);
}

// Estilo de imagenes
function paint() {
  ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(images.ball, ball.x, ball.y, 2 * ball.radius, 2 * ball.radius);
  ctx.drawImage(images.paddle, paddle.x, paddle.y, paddle.width, paddle.height);
  drawBricks();
  drawScore();
  drawLives();
}

// Colision pelota
function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (game.rightKey) {
    paddle.x += paddle.dx;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
  if (game.leftKey) {
    paddle.x -= paddle.dx;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

// Estilo ladrillos
function drawBricks() {
  brickField.forEach((brick) => {
    if (brick.hitsLeft) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }
  });
}

// Puntuaje
function drawScore() {
  ctx.font = "24px ArcadeClassic";
  ctx.fillStyle = "white";
  const { level, score, highScore } = game;
  /* ctx.fillText(`Level: ${level}`, 5, 23);
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, 23);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 4.5 - 50, 23); */
  scoreElement.innerHTML = "Score: " + game.score;
  highScoreElement.innerHTML = "High Score:" + game.highScore;
  localStorage.setItem("high-score_breakout", game.highScore);
}

// Vidas
function drawLives() {
  if (game.lives > 2) {
    ctx.drawImage(images.paddle, canvas.width - 150, 9, 40, 13);
  }
  if (game.lives > 1) {
    ctx.drawImage(images.paddle, canvas.width - 100, 9, 40, 13);
  }
  if (game.lives > 0) {
    ctx.drawImage(images.paddle, canvas.width - 50, 9, 40, 13);
  }
}

// Colisiones de pelota
function detectCollision() {
  const hitTop = () => ball.y < 0;
  const hitLeftWall = () => ball.x < 0;
  const hitRightWall = () => ball.x + ball.radius * 2 > canvas.width;
  const hitPaddle = () =>
    ball.y + 2 * ball.radius > canvas.height - paddle.height &&
    ball.y + ball.radius < canvas.height &&
    ball.x + ball.radius > paddle.x &&
    ball.x + ball.radius < paddle.x + paddle.width;

  if (hitLeftWall()) {
    ball.dx = -ball.dx;
    ball.x = 0;
  }
  if (hitRightWall()) {
    ball.dx = -ball.dx;
    ball.x = canvas.width - 2 * ball.radius;
  }
  if (hitTop()) {
    ball.dy = -ball.dy;
    ball.y = 0;
  }
  if (hitPaddle()) {
    ball.dy = -ball.dy;
    ball.y = canvas.height - paddle.height - 2 * ball.radius;
    game.sfx;
    const drawingConst = 5;
    const paddleMiddle = 2;
    const algo = ((ball.x - paddle.x) / paddle.width) * drawingConst;
    ball.dx = ball.dx + algo - paddleMiddle;
  }
}

// Colision ladrillos
function detectBrickCollision() {
  let directionChanged = false;
  const isBallInsideBrick = (brick) =>
    ball.x + 2 * ball.radius > brick.x &&
    ball.x < brick.x + brick.width &&
    ball.y + 2 * ball.radius > brick.y &&
    ball.y < brick.y + brick.height;

  brickField.forEach((brick) => {
    if (brick.hitsLeft && isBallInsideBrick(brick)) {
      sounds.brick.currentTime = 0;
      game.sfx && sounds.brick.play();
      brick.hitsLeft--;
      if (brick.hitsLeft === 1) {
        brick.color = "darkgray";
      }
      game.score += brick.points;
      game.highScore =
        game.score >= game.highScore ? game.score : game.highScore;

      if (!directionChanged) {
        directionChanged = true;
        detectCollisionDirection(brick);
      }
    }
  });
}

// Direccion de colision y manejo de pelota
function detectCollisionDirection(brick) {
  const hitFromLeft = () => ball.x + 2 * ball.radius - ball.dx <= brick.x;
  const hitFromRight = () => ball.x - ball.dx >= brick.x + brick.width;

  if (hitFromLeft() || hitFromRight()) {
    ball.dx = -ball.dx;
  } else {
    // Colision top o bottom
    ball.dy = -ball.dy;
  }
}

// Comportamiento teclas
function keyDownHandler(e) {
  if (!game.on && e.key === " ") {
    play();
  }
  if (e.key === "ArrowRight") {
    game.rightKey = true;
  } else if (e.key === "ArrowLeft") {
    game.leftKey = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowRight") {
    game.rightKey = false;
  } else if (e.key === "ArrowLeft") {
    game.leftKey = false;
  }
}

// Comportamiento raton
function mouseMoveHandler(e) {
  const mouseX = e.clientX - canvas.offsetLeft;
  const isInsideCourt = () => mouseX > 0 && mouseX < canvas.width;

  if (isInsideCourt()) {
    paddle.x = mouseX - paddle.width / 2;
  }
}

// Nivel completado, se pasa al siguiente
function isLevelCompleted() {
  const levelComplete = brickField.every((b) => b.hitsLeft === 0);

  if (levelComplete) {
    initNextLevel();
    resetBall();
    resetPaddle();
    initBricks();
    game.timeoutId = setTimeout(() => {
      animate();
    }, 3000);

    return true;
  }
  return false;
}

// Inicializar siguiente nivel
function initNextLevel() {
  game.level++;
  game.speed++;

  game.sfx && sounds.levelCompleted.play();
  ctx.font = "50px ArcadeClassic";
  ctx.fillStyle = "yellow";
  ctx.fillText(
    `LEVEL ${game.level}!`,
    canvas.width / 2 - 80,
    canvas.height / 2
  );
}

// Game Over
function isGameOver() {
  const isBallLost = () => ball.y - ball.radius > canvas.height;

  if (isBallLost()) {
    game.lives -= 1;
    game.sfx && sounds.ballLost.play();
    if (game.lives === 0) {
      gameOverBreakout();
      return true;
    }
    resetBall();
    resetPaddle();
  }
  return false;
}
function cambioPuntos(puntos) {
  return puntos;
}
function gameOverBreakout() {
  var numMonedas = cambioPuntos(game.score);
  window.postMessage(
    {
      action: "datosBreackout",
      data: {
        monedas: numMonedas,
        record: game.highScore,
      },
    },
    "*"
  );
  game.on = false;
  sounds.currentTime = 0;
  game.sfx;
  ctx.font = "50px ArcadeClassic";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", canvas.width / 2 - 140, canvas.height / 2);
}

// Inicializar sonidos
initSounds();
