let particles = [];
let numAnchors = 20; // Số lượng điểm neo theo phương dọc
let anchors = []; // Mảng lưu các điểm neo
let isUsingFlowField = false; // Trạng thái particles có di chuyển theo Perlin noise hay không
let cols, rows;
let scale = 20;
let zOffset = 0;
let flowField = [];
let currentShape = 0; // 0 = hình tròn, 1 = ngôi sao, 2 = đầu mèo, 3 = máy ảnh
let isMovingToShape = false; // Trạng thái particles đang di chuyển đến hình dạng
let shapeColor; // Biến lưu màu ngẫu nhiên cho mỗi hình dạng

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  createAnchors(); // Tạo các điểm neo bên ngoài canvas
  updateFlowField(); // Khởi tạo flow field

  // Tạo nhiều particles bắt đầu từ các vị trí ngẫu nhiên
  for (let i = 0; i < 5000; i++) {
    particles[i] = new Particle();
  }

  // Đặt tất cả particles đến các điểm neo bên ngoài canvas
  for (let i = 0; i < particles.length; i++) {
    particles[i].target = random(anchors); // Chọn điểm neo ngẫu nhiên
  }

  background(0); // Đặt nền đen
}

function draw() {

  if (!isUsingFlowField) {
    background(0, 5); // Đặt nền đen với độ mờ thấp
  }

  if (isUsingFlowField) {
    document.dispatchEvent(new Event('flowField'));
    background(0, 1); // Tạo hiệu ứng mờ dần
    let yOffset = 0;

    // Tạo flow field dựa trên Perlin Noise
    for (let y = 0; y < rows; y++) {
      let xOffset = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = noise(xOffset, yOffset, zOffset) * TWO_PI * 4;
        let v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowField[index] = v;
        xOffset += 0.1;
      }
      yOffset += 0.1;
    }
    zOffset += 0.005;

    // Cập nhật và hiển thị particles theo flow field
    for (let i = 0; i < particles.length; i++) {
      particles[i].follow(flowField);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  } else if (isMovingToShape) {
    // Di chuyển các particles theo các điểm neo tạo hình
    for (let i = 0; i < particles.length; i++) {
      particles[i].moveTowardsShape();
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  } else {
    // Di chuyển các particles theo các điểm neo ngoài canvas
    for (let i = 0; i < particles.length; i++) {
      particles[i].moveTowardsAnchor();
      particles[i].update();
      particles[i].edges();
      particles[i].show();
      document.dispatchEvent(new Event('anchors'));
    }
  }
}

// Tạo các điểm neo cho các hình dạng khác nhau
function createAnchors() {
  anchors = []; // Đặt lại mảng anchors
  let spacing = height * 0.1 / (numAnchors - 1); // Khoảng cách giữa các điểm neo
  let start = height * 0.45; // Điểm bắt đầu cách 45% từ cạnh trên

  // Tạo các điểm neo bên ngoài canvas (x = width + 20px)
  for (let i = 0; i < numAnchors; i++) {
    let y = start + i * spacing;
    anchors.push(createVector(width + 20, y)); // Điểm neo ngoài canvas
  }
}

function updateFlowField() {
  cols = floor(width / scale);
  rows = floor(height / scale);
  flowField = new Array(cols * rows);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateFlowField();
}

// Điều khiển trạng thái bằng phím
function keyPressed() {
  if (key === 'f') {
    isUsingFlowField = !isUsingFlowField; // Chuyển đổi giữa flow field và điểm neo
    if (isUsingFlowField) {
      isMovingToShape = false; // Đặt trạng thái không di chuyển đến hình dạng
      
    } else {
      createAnchors(); // Tạo lại các điểm neo bên ngoài canvas
      for (let i = 0; i < particles.length; i++) {
        particles[i].target = random(anchors); // Chọn điểm neo ngẫu nhiên
      }
    }
  }

  if (key === ' ') {
    // Chuyển đổi hình dạng và cho phép di chuyển đến điểm neo
    if (isUsingFlowField) {
      isMovingToShape = true; // Di chuyển đến các điểm neo theo hình dạng
      createShapeAnchors(); // Tạo các điểm neo cho hình dạng
    } else {
      isMovingToShape = true; // Để particle di chuyển đến các điểm neo hình dạng khi không ở trạng thái flow field
      createShapeAnchors(); // Tạo lại hình dạng
    }
  }
}

// Tạo các điểm neo theo hình dạng
function createShapeAnchors() {
  anchors = []; // Xóa các điểm neo cũ
  let centerX = width / 2;
  let centerY = height / 2;
  let radiusX = min(width, height) * 0.3;
  let radiusY = min(width, height) * 0.3;
  // Gán màu ngẫu nhiên khi chuyển đổi hình dạng
  shapeColor = color(random(360), 100, 100, 80); // Màu ngẫu nhiên trong chế độ HSB

  if (currentShape === 0) {
    // Tạo hình tròn
    let numPoints = 12;
    for (let i = 0; i < numPoints; i++) {
      let angle = TWO_PI / numPoints * i;
      let x = centerX + cos(angle) * radiusX;
      let y = centerY + sin(angle) * radiusY;
      anchors.push(createVector(x, y));
    }
  } else if (currentShape === 1) {
    // Tạo hình ngôi sao
    let numPoints = 5;
    for (let i = 0; i < numPoints; i++) {
      let angle = TWO_PI / numPoints * i;
      let x = centerX + cos(angle) * radiusX;
      let y = centerY + sin(angle) * radiusY;
      anchors.push(createVector(x, y));
    }
  } else if (currentShape === 2) {
    // Tạo đầu mèo dẹt hơn
    let headRadiusX = radiusX * 0.9; // Bán kính theo trục X (dẹt)
    let headRadiusY = radiusY * 0.7; // Bán kính theo trục Y (nhỏ hơn)
    let headCenterX = centerX;
    let headCenterY = centerY - radiusY * 0.1; // Điều chỉnh vị trí đầu

    let numHeadPoints = 24;
    for (let i = 0; i < numHeadPoints; i++) {
      let angle = TWO_PI / numHeadPoints * i;
      let x = headCenterX + cos(angle) * headRadiusX;
      let y = headCenterY + sin(angle) * headRadiusY;
      anchors.push(createVector(x, y));
    }

    // Tạo tai mèo
    let leftEar = createVector(centerX - headRadiusX * 1.5, headCenterY - headRadiusY * 1.3); // Tai trái
    let rightEar = createVector(centerX + headRadiusX * 1.5, headCenterY - headRadiusY * 1.3); // Tai phải
    anchors.push(leftEar);
    anchors.push(rightEar);
    
  } else if (currentShape === 3) {
    // Tạo hình chiếc máy ảnh với thân máy và ống kính
    let rectWidth = radiusX * 2.5; // Sử dụng radiusX
    let rectHeight = radiusY * 1.5; // Sử dụng radiusY

    // Nhóm các điểm neo cho hình chữ nhật (thân máy)
    let rectAnchors = [];
    let topLeft = createVector(centerX - rectWidth / 2, centerY - rectHeight / 2);
    let topRight = createVector(centerX + rectWidth / 2, centerY - rectHeight / 2);
    let bottomRight = createVector(centerX + rectWidth / 2, centerY + rectHeight / 2);
    let bottomLeft = createVector(centerX - rectWidth / 2, centerY + rectHeight / 2);

    rectAnchors.push(topLeft, topRight, bottomRight, bottomLeft);
    anchors = anchors.concat(rectAnchors);

    // Nhóm các điểm neo cho hình tròn (ống kính)
    let lensRadiusX = radiusX * 0.6; // Bán kính ống kính
    let lensRadiusY = radiusY * 0.6; // Bán kính ống kính
    let lensCenterX = centerX + rectWidth * 0.2;  // Đặt lệch về bên phải hình chữ nhật
    let lensCenterY = centerY;

    let numLensPoints = 12;
    for (let i = 0; i < numLensPoints; i++) {
      let angle = TWO_PI / numLensPoints * i;
      let x = lensCenterX + cos(angle) * lensRadiusX;
      let y = lensCenterY + sin(angle) * lensRadiusY;
      anchors.push(createVector(x, y));
    }
    } else if (currentShape === 4) {
    // Tạo hình sách mở
    let bookWidth = radiusX * 2;
    let bookHeight = radiusY * 1.5;
    let spineThickness = 30; // Độ dày của gáy sách
    let numPages = 3;
    let pageSpacing = bookHeight / numPages;

    // Vẽ bìa trái
    anchors.push(createVector(centerX - bookWidth / 2, centerY - bookHeight / 2));
    anchors.push(createVector(centerX - bookWidth / 2, centerY + bookHeight / 2));

    // Vẽ bìa phải
    anchors.push(createVector(centerX + bookWidth / 2, centerY - bookHeight / 2));
    anchors.push(createVector(centerX + bookWidth / 2, centerY + bookHeight / 2));



    // Vẽ gáy sách dày hơn
    anchors.push(createVector(centerX - spineThickness / 2, centerY - bookHeight / 2));
    anchors.push(createVector(centerX - spineThickness / 2, centerY + bookHeight / 2));
    anchors.push(createVector(centerX + spineThickness / 2, centerY - bookHeight / 2));
    anchors.push(createVector(centerX + spineThickness / 2, centerY + bookHeight / 2));
  }

  currentShape = (currentShape + 1) % 5; // Tăng hình dạng hiện tại và lặp lại
for (let i = 0; i < particles.length; i++) {
    particles[i].target = random(anchors);   // Gán điểm neo ngẫu nhiên
    particles[i].targetColor = shapeColor;   // Gán màu mục tiêu ngẫu nhiên
}
}
// Particle class
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1, 3); // Tốc độ tối đa ngẫu nhiên cho mỗi particle
    this.target = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    this.hue = random(360); // Màu sắc ngẫu nhiên
    this.targetColor = this.color; // Màu mục tiêu

    // Khởi tạo currentColor là đối tượng màu p5.Color
    this.currentColor = color(255, 255, 255); // Màu trắng ban đầu
  }
  applyForce(force) {
    this.acc.add(force);
  }


  follow(vectors) {
    let x = floor(this.pos.x / scale);
    let y = floor(this.pos.y / scale);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  moveTowardsAnchor() {
    let force = p5.Vector.sub(this.target, this.pos);
    force.setMag(5);
    this.applyForce(force);

    // Cập nhật lại mục tiêu nếu gần với điểm neo
    if (p5.Vector.dist(this.pos, this.target) < 10) {
      this.target = random(anchors);
    }
  }

  moveTowardsShape() {
    let force = p5.Vector.sub(this.target, this.pos);
    force.setMag(1);
    this.applyForce(force);

    // Nếu gần mục tiêu, chọn điểm neo ngẫu nhiên mới
    if (p5.Vector.dist(this.pos, this.target) < 5) {
      this.target = random(anchors);
    }
  }
   update() {
  this.vel.add(this.acc);
  this.vel.limit(this.maxSpeed);
  this.pos.add(this.vel);
  this.acc.mult(0);
}

show() {
  // Kiểm tra chế độ di chuyển
  if (isMovingToShape) {
    // Chế độ di chuyển theo hình dạng -> Màu neon ngẫu nhiên
    colorMode(HSB, 360, 100, 100, 100);
    this.hue = random(); // Hue thay đổi ngẫu nhiên trong khoảng nhỏ
    if (this.hue > 360) this.hue = 0;
    this.targetColor = shapeColor; // Màu neon làm mục tiêu

  } else if (isUsingFlowField) {
    // Chế độ flow field -> Màu neon với hiệu ứng chuyển động
    colorMode(HSB, 360, 100, 100, 100);
    this.hue += 1; // Hue thay đổi liên tục để tạo hiệu ứng neon
    if (this.hue > 360) this.hue = 0;
    this.targetColor = color(this.hue, 100, 100, 80); // Màu neon làm mục tiêu

  } else {
    // Chế độ di chuyển tới các điểm neo bên ngoài canvas -> Màu trắng
    colorMode(RGB);
    this.targetColor = color(255, 255, 255, 200); // Màu trắng làm mục tiêu
  }

  // Chuyển từ màu hiện tại tới màu mục tiêu (smooth transition)
  this.currentColor = lerpColor(this.currentColor, this.targetColor, 0.05);

  // Áp dụng màu hiện tại
  stroke(this.currentColor);
  strokeWeight(1.5);

  // Vẽ đường kết nối vị trí hiện tại với vị trí trước đó
  line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

  // Cập nhật vị trí trước đó
  this.updatePrev();
}

updatePrev() {
  this.prevPos.x = this.pos.x;
  this.prevPos.y = this.pos.y;
}

edges() {
  // Khi particle ra khỏi canvas, đặt nó ở phía ngược lại và chọn điểm neo mới
  if (this.pos.x > width + 20) {
    this.pos.x = -20;
    this.target = random(anchors);
    this.updatePrev();
  }
  if (this.pos.x < -20) {
    this.pos.x = width + 20;
    this.target = random(anchors);
    this.updatePrev();
  }
  if (this.pos.y > height) {
    this.pos.y = 0;
    this.updatePrev();
  }
  if (this.pos.y < 0) {
    this.pos.y = height;
    this.updatePrev();
  }
}
}

