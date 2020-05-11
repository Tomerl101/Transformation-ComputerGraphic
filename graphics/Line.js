class Line {
  constructor(startX, startY, endX, endY) {
    console.log('create new line...');
    this.p1 = { x: startX, y: startY };
    this.p2 = { x: endX, y: endY };
  }

  draw(ctx) {
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
}
