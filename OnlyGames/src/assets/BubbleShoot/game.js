var canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  stopGame();
});

// Variables & Constants
var SHOOT = new Audio();
SHOOT.src = "./assets/BubbleShoot/click.wav";
var EXP = new Audio();
EXP.src = "./assets/BubbleShoot/laserShoot.wav";
var c = canvas.getContext("2d");
var scoreEl = document.getElementById("scoreEl");
var score_ = document.getElementById("score");
var highestEl = document.getElementById("highestEl");
var startGameBtn = document.getElementById("startGameBtn");
var modelEl = document.getElementById("modelEl");
var bigScoreEl = document.getElementById("bigScoreEl");
var friction = 0.98;
var x = canvas.width / 2;
var y = canvas.height / 2;
var projectiles = [];
var enemies = [];
var particles = [];
var score = 0;
var highest = localStorage.getItem("high-score_bubbleshoot") || 0;
var animationId;
var spanEnemiesInterval;
var spawnTime = 1000;
highestEl.innerHTML = highest;

// Starting Ball Class
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

// Shooter Ball for Moving Ball
class Shooter extends Ball {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color);
    this.velocity = velocity;
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// Particle for Exploding Shooter BAll
class Particle extends Shooter {
  constructor(x, y, radius, color, velocity) {
    EXP.play();
    super(x, y, radius, color, velocity);
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x * 2;
    this.y = this.y + this.velocity.y * 2;
    this.alpha -= 0.01;
  }
}

function updateScore(times = 1) {
  localStorage.setItem("high-score_bubbleshoot", highest);
  spawnTime *= 0.9995;
  score += 100 * times;
  scoreEl.innerHTML = score;
  highest = score >= highest ? score : highest;
  highestEl.innerHTML = highest;
}

// Calculate Velocity from center(x, y) to (x1,y1)
function calculateVelocity(
  x,
  y,
  x1 = canvas.width / 2,
  y1 = canvas.height / 2
) {
  var angle = Math.atan2(y1 - y, x1 - x);
  var velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  return velocity;
}

// Animation
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";

  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  // Updates and remove particles
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  // Update and remove projectiles
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (
      projectile.x + projectile.radius < 1 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  // Update & Destroy Enemies, Create Explosions & Increase Score
  enemies.forEach((enemy, index) => {
    enemy.update();

    // Calculate distance between player(player.x, player.y) and enemy(enemy.x, enemy.y) using Math.hypot(perpendicular, base) which gives hypotenuse / distance between them
    var dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    // Checking if player and enemy is collided
    if (dist - enemy.radius - player.radius < 1) {
      stopGame();
    }

    projectiles.forEach((projectile, projectileIndex) => {
      var dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // When Projectiles touch Enemy
      if (dist - enemy.radius - projectile.radius < 0) {
        // Create Particles explosion
        for (var i = 0; i < enemy.radius * 1; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 3,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 9.8 - 0.5),
                y: (Math.random() - 0.5) * (Math.random() * 9.8 - 0.5),
              }
            )
          );
        }

        // Check if enemy is to be removed or not
        if (enemy.radius - 10 > 10) {
          updateScore();
          enemy.radius -= 8;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          updateScore(2.5);
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

// Shoot Enemy
function shootEnemy(e) {
  SHOOT.play();
  var x = canvas.width / 2,
    y = canvas.height / 2;

  v = calculateVelocity(x, y, e.clientX, e.clientY);
  v.x *= 5.5;
  v.y *= 5.5;

  projectiles.push(new Shooter(x, y, 5, "white", v));
}

// Reinitializing Variables for Starting a New Game
function init() {
  player = new Ball(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  spawnTime = 1000;
  highestEl.innerHTML = score;
  scoreEl.innerHTML = score;
  highestEl.innerHTML = highest;
}

// Stop Game
function stopGame() {
  window.postMessage(
    {
      action: "datosBubbleShoot",
      data: {
        monedas: 20,
      },
    },
    "*"
  );
  clearInterval(spanEnemiesInterval);
  cancelAnimationFrame(animationId); // Exit Animation
  canvas.removeEventListener("click", shootEnemy); // Stop Shooting
  modelEl.style.display = "flex"; // Dialogue box
  if (score > highest) {
    highest = score;
  }
  bigScoreEl.innerHTML = score; // Poping score
}

// Spawning Random Enemies
function spanEnemies() {
  // Spawn a enemy every second
  spanEnemiesInterval = setTimeout(() => {
    var x, y;
    var radius = Math.random() * 16 + 14;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    var color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;
    enemies.push(new Shooter(x, y, radius, color, calculateVelocity(x, y)));
    spanEnemies();
  }, spawnTime);
}

// Start New Game
function startGame() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  canvas.addEventListener("click", shootEnemy);
  init();
  animate();
  clearInterval(spanEnemiesInterval);
  spanEnemies();
  modelEl.style.display = "none";
  score_.style.visibility = "visible";
}

// Start Game Button
startGameBtn.addEventListener("click", startGame);
