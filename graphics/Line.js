class Line {
  constructor(startX, startY, endX, endY) {
    console.log('create new line...');
    this.p1 = { x: Number(startX), y: Number(startY) };
    this.p2 = { x: Number(endX), y: Number(endY) };
  }

  draw(ctx) {
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
}

//trying to normalize vector from world coords to screen view coords (not working...)
// const a1 = math.matrix([this.p1.x, this.p1.y, 1]);
// const b1 = math.matrix([
//   [this.p1.x, 0, 0],
//   [0, this.p1.y, 0],
//   [0, 700 * (1 - this.p2.y), 1],
// ]);
// const result1 = math.multiply(a1, b1);

// const a2 = math.matrix([this.p2.x, this.p2.y, 1]);
// const b2 = math.matrix([
//   [this.p2.x, 0, 0],
//   [0, this.p2.y, 0],
//   [0, 700 * (1 - this.p2.y), 1],
// ]);
// const result2 = math.multiply(a2, b2);
