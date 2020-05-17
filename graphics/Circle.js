class Circle {
  constructor(centerX, centerY, radius, fill = '') {
    console.log('create new circle...');
    this.center = { x: Number(centerX), y: Number(centerY) };
    this.radius = { x: Number(radius), y: Number(radius) };
    this.fill = fill;
    this.isEllipse = false;
    this.rotation = 0;
    this.top = {};
    this.right = {};
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.ellipse(this.center.x, this.center.y, this.radius.x, this.radius.y, this.rotation, 0, Math.PI * 2);
    ctx.stroke();
  }

  getMinMaxY() {
    const min = this.center.y - this.radius.y;
    const max = this.center.y + this.radius.y;
    return { min, max };
  }

  getMinMaxX() {
    const min = this.center.x - this.radius.x;
    const max = this.center.x + this.radius.x;
    return { min, max };
  }

  scale(x, y, sx, sy) {
    const pointsToScale = [this.center];
    let result = doScale(pointsToScale, x, y, sx, sy);
    //update points with new values
    this.center = result[0];
    this.radius.x *= sx;
    this.radius.y *= sy;
  }

  mirror(axis = 'y') {
    const pointsToMirror = [this.center];
    let result = doMirror(pointsToMirror, axis);
    //update points with new values
    this.center = result[0];
    this.rotation *= -1;
  }

  translate(x = 0, y = 0) {
    const pointsToTranslate = [this.center];
    let result = doTranslate(pointsToTranslate, x, y);
    //update points with new values
    this.center = result[0];
  }

  rotate(cx, cy, angle) {
    const pointsToRotate = [this.center];
    let result = doRotate(pointsToRotate, cx, cy, angle);
    //update points with new values
    this.center = result[0];
    this.rotation += (Math.PI / 180) * angle;
  }

  mapping(sx, sy, wxl, wyb, vxl, vyb) {
    const pointsToMap = [this.center];
    let result = doMapping(pointsToMap, sx, sy, wxl, wyb, vxl, vyb);
    this.center = result[0];
    this.radius.x *= sx;
    this.radius.y *= sy;
  }

  shear(x1 = 0, x2 = 0) {
    const pointsToShear = [this.center];
    let result = doShear(pointsToShear, x1, x2);
    this.center = result[0];
  }
}
