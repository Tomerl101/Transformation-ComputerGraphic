class Curve {
  constructor(startX, startY, controlX, controlY, controlX2, controlY2, endX, endY) {
    this.start = { x: Number(startX), y: Number(startY) };
    this.end = { x: Number(endX), y: Number(endY) };
    this.control1 = { x: Number(controlX), y: Number(controlY) };
    this.control2 = { x: Number(controlX2), y: Number(controlY2) };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
    ctx.stroke();
  }

  getMinMaxY() {
    const min = Math.min(this.start.y, this.control1.y, control2.y, end.y);
    const max = Math.max(this.start.y, this.control1.y, control2.y, end.y);
    return { min, max };
  }

  getMinMaxX() {
    const min = Math.min(this.start.x, this.control1.x, control2.x, end.x);
    const max = Math.max(this.start.x, this.control1.x, control2.x, end.x);
    return { min, max };
  }
}
