const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circles = [];
const lines = [];

const wind = {
  x: 0.02, // 바람의 x 방향 세기
  y: 0.02, // 바람의 y 방향 세기
};

const wall = {
  left: 0,
  top: 0,
  right: canvas.width,
  bottom: canvas.height,
};

let isMouseDown = false;

// 마우스 클릭 상태 이벤트 처리
canvas.addEventListener('mousedown', () => {
  isMouseDown = true;
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;

  if (circles.length < 10) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    createSmallCircle(mouseX, mouseY);

    draw();
  }
});

// 마우스 이동 이벤트 처리
canvas.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  if (isMouseDown) {
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

// 바람에 의한 랜덤한 초기 속도의 최대값
const maxWindSpeed = 1;

// 바람에 의한 속도 업데이트 함수
function updateWind() {
  wind.x += (Math.random() - 0.5) * 0.01;
  wind.y += (Math.random() - 0.5) * 0.01;

  const speed = Math.sqrt(wind.x ** 2 + wind.y ** 2);
  if (speed > maxWindSpeed) {
    const scaleFactor = maxWindSpeed / speed;
    wind.x *= scaleFactor;
    wind.y *= scaleFactor;
  }
}

// 화면 업데이트 함수
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateWind();

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
      circle.x - circle.radius < wall.left ||
      circle.x + circle.radius > wall.right
    ) {
      circle.vx *= -1;
      circle.ax *= -1;
    }
    if (
      circle.y - circle.radius < wall.top ||
      circle.y + circle.radius > wall.bottom
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
