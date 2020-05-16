class Curve {
  constructor(startX, startY, controlX, controlY, controlX2, controlY2, endX, endY) {
    this.start = { x: Number(startX), y: Number(startY) };
    this.end = { x: Number(endX), y: Number(endY) };
    this.control1 = { x: Number(controlX), y: Number(controlY) };
    this.control2 = { x: Number(controlX2), y: Number(controlY2) };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.bezierCurveTo(
      this.control1.x,
      this.control1.y,
      this.control2.x,
      this.control2.y,
      this.end.x,
      this.end.y
    );
    ctx.stroke();
  }

  getMinMaxY() {
    const min = Math.min(this.start.y, this.control1.y, this.control2.y, this.end.y);
    const max = Math.max(this.start.y, this.control1.y, this.control2.y, this.end.y);
    return { min, max };
  }

  getMinMaxX() {
    const min = Math.min(this.start.x, this.control1.x, this.control2.x, this.end.x);
    const max = Math.max(this.start.x, this.control1.x, this.control2.x, this.end.x);
    return { min, max };
  }

  translate(x = 0, y = 0) {
    const pointsToTranslate = [this.start, this.control1, this.control2, this.end];
    let result = doTranslate(pointsToTranslate, x, y);
    //update points with new values
    this.start = result[0];
    this.control1 = result[1];
    this.control2 = result[2];
    this.end = result[3];
  }

  scale(x, y, sx, sy) {
    const pointsToScale = [this.start, this.control1, this.control2, this.end];
    let result = doScale(pointsToScale, x, y, sx, sy);
    //update points with new values
    this.start = result[0];
    this.control1 = result[1];
    this.control2 = result[2];
    this.end = result[3];
  }

  mirror(axis = 'y') {
    const pointsToMirror = [this.start, this.control1, this.control2, this.end];
    let result = doMirror(pointsToMirror, axis);
    //update points with new values
    this.start = result[0];
    this.control1 = result[1];
    this.control2 = result[2];
    this.end = result[3];
  }

  rotate(cx, cy, angle) {
    const pointsToRotate = [this.start, this.control1, this.control2, this.end];
    let result = doRotate(pointsToRotate, cx, cy, angle);

    //update points with new values
    this.start = result[0];
    this.control1 = result[1];
    this.control2 = result[2];
    this.end = result[3];
  }

  mapping(sx, sy, wxl, wyb, vxl, vyb) {
    const pointsToMap = [this.start, this.control1, this.control2, this.end];
    let result = doMapping(pointsToMap, sx, sy, wxl, wyb, vxl, vyb);
    //update points with new values
    this.start = result[0];
    this.control1 = result[1];
    this.control2 = result[2];
    this.end = result[3];
  }

  //shear
}
