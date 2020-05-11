class Curve {
  constructor(startX, startY, controlX, controlY, controlX2, controlY2, endX, endY) {
    this.start = { x: startX, y: startY };
    this.end = { x: endX, y: endY };
    this.control1 = { x: controlX, y: controlY };
    this.control2 = { x: controlX2, y: controlY2 };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
    ctx.stroke();
  }
}
