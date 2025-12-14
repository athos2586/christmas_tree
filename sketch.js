let particles = [];
let decorations = [];
let santa = [];
let model, video;

let targetShape = 0; // 0 = tree, 1 = santa
let currentShape = 0;

const NUM_PARTICLES = 2000;

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create tree shape particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let h = random(0, 1);
    let r = (1 - h) * 260;
    let ang = random(TAU);
    particles.push({
      treeX: r * cos(ang),
      treeY: -h * 550,
      treeZ: r * sin(ang),
      santaX: random(-150, 150),
      santaY: random(-400, 200),
      santaZ: random(-20, 20),
      type: "tree"
    });
  }

  // Decorations (baubles)
  for (let i = 0; i < 120; i++) {
    let h = random(0, 1);
    let r = (1 - h) * 260;
    let ang = random(TAU);
    decorations.push({
      x: r * cos(ang),
      y: -h * 550,
      z: r * sin(ang),
      colour: random(["red", "gold"])
    });
  }

  // Santa shape (hat, beard, face)
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let y = random(-450, 150);
    let x = random(-200, 200);
    let z = random(-30, 30);

    santa.push({ x, y, z });
  }

  // Camera
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  video.elt.setAttribute("playsinline", "");

  // Model
  model = await handpose.load();
  console.log("Handpose loaded");
}

async function detectHand() {
  if (!model) return;
  const predictions = await model.estimateHands(video.elt);

  if (predictions.length > 0) {
    let handY = predictions[0].boundingBox.topLeft[1];

    // Map handY to shape
    targetShape = map(handY, 0, 480, 0, 1);
    targetShape = constrain(targetShape, 0, 1);
  }
}

function draw() {
  background(5);
  rotateY(millis() * 0.00025);

  detectHand();

  // Smooth interpolation
  currentShape = lerp(currentShape, targetShape, 0.05);

  let t = currentShape; // 0 tree, 1 santa

  // Draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let sx = lerp(p.treeX, santa[i].x, t);
    let sy = lerp(p.treeY, santa[i].y, t);
    let sz = lerp(p.treeZ, santa[i].z, t);

    push();
    if (t < 0.5) fill(0, 255, 0); // green tree
    else fill(255, 80, 80); // santa red
    noStroke();
    translate(sx, sy, sz);
    sphere(4);
    pop();
  }

  // Decorations (only visible in tree mode)
  if (t < 0.7) {
    for (let d of decorations) {
      push();
      if (d.colour === "red") fill(255, 0, 0);
      else fill(255, 215, 0); // gold

      noStroke();
      translate(d.x, d.y, d.z);
      sphere(8);
      pop();
    }

    // Star on top
    push();
    translate(0, -560, 0);
    fill(255, 255, 80);
    sphere(20);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
