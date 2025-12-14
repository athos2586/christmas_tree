let particles = [];
let model;
let video;
let handX = 320; // default centre

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create Christmas tree particles
  for (let i = 0; i < 1000; i++) {
    let h = random(0, 1);
    let r = (1 - h) * 200;
    let angle = random(TAU);
    particles.push({
      x: r * cos(angle),
      y: -h * 350,
      z: r * sin(angle),
    });
  }

  // Start webcam
  video = createCapture(VIDEO, () => {
    console.log("Camera initialised");
  });
  video.size(640, 480);
  video.hide();
  video.elt.setAttribute("playsinline", "");

  // Load handpose model
  model = await handpose.load();
  console.log("Handpose model loaded");
}

async function estimateHand() {
  if (!model) return;

  const predictions = await model.estimateHands(video.elt);

  if (predictions.length > 0) {
    // Get x-position of hand bounding box
    handX = predictions[0].boundingBox.topLeft[0];
  }
}

function draw() {
  background(10);

  rotateY(millis() * 0.0002);

  // Draw tree particles
  for (let p of particles) {
    push();
    let c = map(handX, 0, 640, 50, 255);
    fill(c, 200, 200);
    noStroke();
    translate(p.x, p.y, p.z);
    sphere(4);
    pop();
  }

  estimateHand();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
