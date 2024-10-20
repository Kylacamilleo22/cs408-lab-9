// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Variables for count paragraph
const p = document.querySelector("p");
let count = 0;

const h2 = document.querySelector("h2");

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Evil circle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  // Draw the Ecircle
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3; 
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Make sure the Ecircle doesnt go out of bounds
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x = -Math.abs(this.x);
    }

    if (this.x - this.size <= 0) {
      this.x = Math.abs(this.x);
    }

    if (this.y + this.size >= height) {
      this.y = -Math.abs(this.y);
    }

    if (this.y - this.size <= 0) {
      this.y = Math.abs(this.y);
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists == true) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If Evillcircle and ball collides then "delete" the ball
        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          p.textContent = "Ball Count: " + count;
        }
        // If no more balls to collect
        if (count == 0) {
          h2.textContent = "Congratulations, you've won!"
        }
      }
    }
  }

}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists == true) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
  // To make the ball count appear when starting
  count++; // count = 25;
  p.textContent = "Ball count: " + count;
}

// Create the evilcircle on the middle
const circle = new EvilCircle(width/2,height/2);

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // Iterate through the balls and if exists then draw, update, collision
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
    circle.draw();
    circle.checkBounds();
    circle.collisionDetect();
  }
  requestAnimationFrame(loop);
}

loop();