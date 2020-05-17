class Line {
  constructor(startX, startY, endX, endY) {
    this.p1 = { x: Number(startX), y: Number(startY) };
    this.p2 = { x: Number(endX), y: Number(endY) };
  }

  draw(ctx) {
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }

  getMinMaxY() {
    const min = Math.min(this.p1.y, this.p2.y);
    const max = Math.max(this.p1.y, this.p2.y);
    return { min, max };
  }

  getMinMaxX() {
    const min = Math.min(this.p1.x, this.p2.x);
    const max = Math.max(this.p1.x, this.p2.x);
    return { min, max };
  }

  scale(x, y, sx, sy) {
    const pointsToScale = [this.p1, this.p2];
    let result = doScale(pointsToScale, x, y, sx, sy);
    //update points with new values
    this.p1 = result[0];
    this.p2 = result[1];
  }

  mirror(axis = 'y') {
    const pointsToRotate = [this.p1, this.p2];
    let result = doMirror(pointsToRotate, axis);
    //update points with new values
    this.p1 = result[0];
    this.p2 = result[1];
  }

  translate(x = 0, y = 0) {
    const pointsToTranslate = [this.p1, this.p2];
    let result = doTranslate(pointsToTranslate, x, y);
    //update points with new values
    this.p1 = result[0];
    this.p2 = result[1];
  }

  rotate(cx, cy, angle) {
    const pointsToRotate = [this.p1, this.p2];
    let result = doRotate(pointsToRotate, cx, cy, angle);
    //update points with new values
    this.p1 = result[0];
    this.p2 = result[1];
  }

  mapping(sx, sy, wxl, wyb, vxl, vyb) {
    const pointsToMap = [this.p1, this.p2];
    let result = doMapping(pointsToMap, sx, sy, wxl, wyb, vxl, vyb);
    this.p1 = result[0];
    this.p2 = result[1];
  }

  shear(x1 = 0, x2 = 0) {
    const pointsToShear = [this.p1, this.p2];
    let result = doShear(pointsToShear, x1, x2);
    this.p1 = result[0];
    this.p2 = result[1];
  }
}
