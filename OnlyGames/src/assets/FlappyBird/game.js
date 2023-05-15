// Seleccionar cvs
var cvs = document.getElementById("bird");
var ctx = cvs.getContext("2d");
var highScoreElement = document.querySelector(".high-score");
var scoreElement = document.querySelector(".score");
// Variables y constantes
var frames = 0;
var DEGREE = Math.PI / 180;

// Cargar imagenes
var sprite = new Image();
sprite.src = "./assets/FlappyBird/sprite.png";

// Cargar sonidos
var SCORE_S = new Audio();
SCORE_S.src = "./assets/FlappyBird/sfx_point.wav";

var FLAP = new Audio();
FLAP.src = "./assets/FlappyBird/sfx_flap.wav";

var HIT = new Audio();
HIT.src = "./assets/FlappyBird/sfx_hit.wav";

var SWOOSHING = new Audio();
SWOOSHING.src = "./assets/FlappyBird/sfx_swooshing.wav";

var DIE = new Audio();
DIE.src = "./assets/FlappyBird/sfx_die.wav";

// Estado juego
var state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};

// Boton empezar
var startBtn = {
  x: 220,
  y: 500,
  w: 153,
  h: 49,
};

// Controles de juego
cvs.addEventListener("click", function (evt) {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      SWOOSHING.play();
      break;
    case state.game:
      if (bird.y - bird.radius <= 0) return;
      bird.flap();
      FLAP.play();
      break;
    case state.over:
      var rect = cvs.getBoundingClientRect();
      var clickX = evt.clientX - rect.left;
      var clickY = evt.clientY - rect.top;

      // CHECK IF WE CLICK ON THE START BUTTON
      if (
        clickX >= startBtn.x &&
        clickX <= startBtn.x + startBtn.w &&
        clickY >= startBtn.y &&
        clickY <= startBtn.y + startBtn.h
      ) {
        pipes.reset();
        bird.speedReset();
        score.reset();
        state.current = state.getReady;
      }
      break;
  }
});

// Background
var bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );

    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};

// Foreground
var fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,

  dx: 2,

  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );

    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },

  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};

// Pajaro
var bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 },
  ],
  x: 50,
  y: 150,
  w: 34,
  h: 26,

  radius: 12,

  frame: 0,

  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw: function () {
    var bird = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );

    ctx.restore();
  },

  flap: function () {
    this.speed = -this.jump;
  },

  update: function () {
    // Si el juego acaba de empezar, el pajaro va despacio
    this.period = state.current == state.getReady ? 10 : 5;
    // Incrementamos 1 la velocidad por cada periodo
    this.frame += frames % this.period == 0 ? 1 : 0;
    // Frame de 0 a 4
    this.frame = this.frame % this.animation.length;

    if (state.current == state.getReady) {
      this.y = 150; // Resetear posicion de pajaro al morir
      this.rotation = 0 * DEGREE;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;
        if (state.current == state.game) {
          state.current = state.over;
          DIE.play();
        }
      }

      // Logica para muerte de pajaro
      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },
  speedReset: function () {
    this.speed = 0;
  },
};

// Mensaje de listo
var getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,

  draw: function () {
    if (state.current == state.getReady) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

// Game Over
var gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,

  draw: function () {
    if (state.current == state.over) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

// Tuberias
var pipes = {
  position: [],

  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },

  w: 53,
  h: 400,
  gap: 85,
  maxYPos: -150,
  dx: 2,

  draw: function () {
    for (var i = 0; i < this.position.length; i++) {
      var p = this.position[i];

      var topYPos = p.y;
      var bottomYPos = p.y + this.h + this.gap;

      // Tuberia Top
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );

      // Tuberia Bottom
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },

  update: function () {
    if (state.current !== state.game) return;

    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }
    for (var i = 0; i < this.position.length; i++) {
      var p = this.position[i];

      var bottomPipeYPos = p.y + this.h + this.gap;

      // Detectar colision
      // Tuberia Top
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        state.current = state.over;
        HIT.play();
      }
      // Tuberia Bottom
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeYPos &&
        bird.y - bird.radius < bottomPipeYPos + this.h
      ) {
        state.current = state.over;
        HIT.play();
      }

      // Movimiento de tuberias
      p.x -= this.dx;

      // Si la tuberia sale del rango, se elimina del array
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        scoreElement.innerHTML = "Score: " + score.value
        SCORE_S.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("high-score_flappy", score.best);
        highScoreElement.innerHTML = "High Score: " + score.best
      }
    }
  },

  reset: function () {
    this.position = [];
  },
};

// Score
var score = {
  // TODO: Dependiendo quien se logee la puntuacion maxima valdra una cosa u otra
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  draw: function () {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px Teko";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (state.current == state.over) {
      // Valor Score
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      scoreElement.innerHTML = "Score: " + this.value
      // Valor HighScore
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },

  reset: function () {
    this.value = 0;
  },
};

// DRAW
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

// UPDATE
function update() {
  bird.update();
  fg.update();
  pipes.update();
}

// LOOP
function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}
loop();
