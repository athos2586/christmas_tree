let particles = [];
let model, video;
let handX = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // create particles in a Christmas tree cone form
  for (let i = 0; i < 800; i++) {
    let r = random(0.1, 1);
    let angle = random(TAU);
    let height = random(1);
    let radius = (1 - height) * 200;
    particles.push({
      x: radius * cos(angle),
      y: -height * 300,
      z: radius * sin(angle),
    });
  }

  // Webcam setup
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  model = await handpose.load();
}

function draw() {
  background(10);

  translate(width / 2, height * 0.8);
  rotateY(millis() * 0.0002);

  // draw “tree”
  stroke(255);
  for (let p of particles) {
    push();
    let hueShift = map(handX, 0, width, 0, 255);
    fill(100 + hueShift, 200, 200);
    noStroke();
    translate(p.x, p.y, p.z);
    ellipse(0, 0, 5);
    pop();
  }

  detectHand();
}

async function detectHand() {
  if (!model) return;
  const predictions = await model.estimateHands(video.elt);

  if (predictions.length > 0) {
    handX = predictions[0].boundingBox.topLeft[0];
  }
}
