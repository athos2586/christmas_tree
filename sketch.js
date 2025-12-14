let particles = [];
let model, video;
let handX = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create particles shaped like a Christmas tree (cone)
  for (let i = 0; i < 1000; i++) {
    let h = random(0, 1);                 // height 0–1
    let r = (1 - h) * 200;                // radius decreases towards top
    let angle = random(TAU);              // random angle
    particles.push({
      x: r * cos(angle),
      y: -h * 350,
      z: r * sin(angle),
    });
  }

  // Webcam initialisation
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  model = await handpose.load();
}

function draw() {
  background(10);
  rotateY(millis() * 0.0002); // slow auto-rotation

  // Draw particles
  for (let p of particles) {
    push();
    let c = map(handX, 0, 640, 50, 255);
    fill(c, 200, 200);
    noStroke();
    translate(p.x, p.y, p.z);
    sphere(4);
    pop();
  }

  detectHand();
}

async function detectHand() {
  if (!model) return;
  const prediction = await model.estimateHands(video.elt);

  if (prediction.length > 0) {
    handX = prediction[0].boundingBox.topLeft[0];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
