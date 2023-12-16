const particles = [];
let hoveredParticle = null;
const imgs = [];
const imgPaths = ['assets/pImg1.jpg', 'assets/pImg2.jpg'];
let cam;
let camGraphics;

function preload() {
  imgPaths.forEach((eachPath) => {
    imgs.push(loadImage(eachPath));
  });
}

function setup() {
  setCanvasContainer('canvas', 1, 1, true);
  cam = createCapture(VIDEO);
  cam.size(320, 240); // 카메라 크기 조절
  cam.hide();

  camGraphics = createGraphics(cam.width, cam.height);

  rectMode(CENTER);
  imageMode(CENTER);

  background('#A6C7CE ');
}

function draw() {
  background('#A6C7CE ');

  camGraphics.image(cam, 0, 0, cam.width, cam.height);

  // 블러 필터
  camGraphics.filter(BLUR, 5); // 블러 강도 조절

  camGraphics.tint(255, 150); // 곱하기 효과

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
