const particles = [];
let hoveredParticle = null;
const imgs = [];
const imgPaths = ['assets/pImg1.jpg', 'assets/pImg2.jpg'];
let cam;
let camGraphics; // 추가

function preload() {
  imgPaths.forEach((eachPath) => {
    imgs.push(loadImage(eachPath));
  });
}

function setup() {
  setCanvasContainer('canvas', 1, 1, true);
  cam = createCapture(VIDEO);
  cam.size(320, 240); // 크기 조절 (원하는 크기로 조절)
  cam.hide(); // 기본 캔버스에는 표시하지 않음

  camGraphics = createGraphics(cam.width, cam.height); // 추가

  rectMode(CENTER);
  imageMode(CENTER);

  background('#A6C7CE ');
}

function draw() {
  background('#A6C7CE ');

  // Draw camera feed to camGraphics
  camGraphics.image(cam, 0, 0, cam.width, cam.height);

  // Apply blur filter to camGraphics
  camGraphics.filter(BLUR, 5); // 블러 강도 조절 가능

  // Apply tint to add color (multiply with white)
  camGraphics.tint(255, 150); // 투명한 흰색에 150의 투명도로 곱하기

  // Draw camGraphics to the canvas
  image(camGraphics, width / 2, height / 2, width, height);

  chkHover();
  particles.forEach((eachParticle) => {
    eachParticle.update(hoveredParticle);
  });

  stroke(0);
  particles.forEach((eachParticle, idx) => {
    if (idx !== 0) {
      line(
        particles[idx - 1].pos.x,
        particles[idx - 1].pos.y,
        eachParticle.pos.x,
        eachParticle.pos.y
      );
    }
  });

  strokeWeight(1);
  noFill();
  ellipse(width / 2, height / 2, width - 8, height - 8);

  noStroke();
  particles.forEach((eachParticle) => {
    if (hoveredParticle !== eachParticle) eachParticle.display(hoveredParticle);
  });
  hoveredParticle?.display(hoveredParticle);

  console.log(hoveredParticle);
}

function chkHover() {
  let nothingHovered = true;
  for (let idx = 0; idx < particles.length; idx++) {
    if (particles[idx].isHover(mouseX, mouseY)) {
      nothingHovered = false;
      hoveredParticle = particles[idx];
      break;
    }
  }
  if (nothingHovered) {
    hoveredParticle = null;
  }
}

function mouseDragged() {
  const mouseDistSq = (width / 2 - mouseX) ** 2 + (height / 2 - mouseY) ** 2;
  if (mouseDistSq >= (width / 2) ** 2) return;

  const prob = random();
  const random2D = p5.Vector.random2D();
  random2D.mult(random(25, 50));

  particles.push(
    new Particle(
      mouseX,
      mouseY,
      random2D.x + mouseX,
      random2D.y + mouseY,
      random(5, 10),
      color(random(255), random(255), random(255)),
      imgs[floor(random(imgs.length))]
    )
  );

  if (prob > 0.5) {
    random2D.rotate(random(TAU));
    particles.push(
      new Particle(
        mouseX,
        mouseY,
        random2D.x + mouseX,
        random2D.y + mouseY,
        random(5, 10),
        color(random(255), random(255), random(255)),
        imgs[floor(random(imgs.length))]
      )
    );
  }
}
