const particles = [];
let hoveredParticle = null;
const imgs = [];
const imgPaths = ['assets/pImg1.jpg', 'assets/pImg2.jpg'];

function preload() {
  imgPaths.forEach((eachPath) => {
    imgs.push(loadImage(eachPath));
  });
}

function setup() {
  setCanvasContainer('canvas', 1, 1, true);

  rectMode(CENTER);
  imageMode(CENTER);

  background('white');
}

function draw() {
  chkHover();
  particles.forEach((eachParticle) => {
    eachParticle.update(hoveredParticle);
  });

  background('white');

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

function mouseClicked() {
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
