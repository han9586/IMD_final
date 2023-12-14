const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bigCircle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: Math.min(canvas.width, canvas.height) / 2 - 10,
};

const circles = [];
const lines = [];

let isMouseDown = false;

// 마우스 클릭 상태 이벤트 처리
canvas.addEventListener('mousedown', (event) => {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  // 큰 원 안에서만 작은 원 생성
  if (isInsideBigCircle(mouseX, mouseY)) {
    createSmallCircle(mouseX, mouseY);
    draw();
  }

  isMouseDown = true;
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// 마우스 이동 이벤트 처리
canvas.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  if (isMouseDown && isInsideBigCircle(mouseX, mouseY)) {
    createSmallCircle(mouseX, mouseY);
    draw();
  }
});

// 마우스 클릭 시 작은 원 생성 함수
function createSmallCircle(x, y) {
  const circle = {
    x,
    y,
    radius: Math.random() * 20 + 5,
    color: getRandomColor(),
    vx: 0,
    vy: 0,
    ax: (Math.random() - 0.5) * 0.1,
    ay: (Math.random() - 0.5) * 0.1,
  };

  circles.push(circle);

  if (circles.length > 1) {
    const startCircle = circles[circles.length - 2];
    const endCircle = circles[circles.length - 1];

    lines.push({
      startCircle,
      endCircle,
      color: getRandomColor(),
    });
  }
}

// 랜덤한 색상을 반환하는 함수
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 큰 원 안에 위치하는지 확인하는 함수
function isInsideBigCircle(x, y) {
  const distance = Math.sqrt((x - bigCircle.x) ** 2 + (y - bigCircle.y) ** 2);
  return distance <= bigCircle.radius;
}

// 화면 업데이트 함수
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(bigCircle.x, bigCircle.y, bigCircle.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  for (const line of lines) {
    ctx.beginPath();
    ctx.moveTo(line.startCircle.x, line.startCircle.y);
    ctx.lineTo(line.endCircle.x, line.endCircle.y);
    ctx.strokeStyle = line.color;
    ctx.stroke();
    ctx.closePath();
  }

  for (const circle of circles) {
    circle.vx += circle.ax;
    circle.vy += circle.ay;

    circle.x += circle.vx;
    circle.y += circle.vy;

    circle.vx *= 0.98;
    circle.vy *= 0.98;

    circle.ax *= 0.98;
    circle.ay *= 0.98;

    if (
      circle.x - circle.radius < bigCircle.x - bigCircle.radius ||
      circle.x + circle.radius > bigCircle.x + bigCircle.radius
    ) {
      circle.vx *= -1;
      circle.ax *= -1;
    }
    if (
      circle.y - circle.radius < bigCircle.y - bigCircle.radius ||
      circle.y + circle.radius > bigCircle.y + bigCircle.radius
    ) {
      circle.vy *= -1;
      circle.ay *= -1;
    }

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
  }

  requestAnimationFrame(draw);
}

draw();
