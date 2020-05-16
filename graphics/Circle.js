class Circle {
  constructor(centerX, centerY, radius, fill = '') {
    console.log('create new circle...');
    this.center = { x: Number(centerX), y: Number(centerY) };
    this.radius = Number(radius);
    this.fill = fill;
    this.isEllipse = false;

    this.top = {};
    this.right = {};
  }

  draw(ctx) {
    if (this.isEllipse) {
      //draw ellipse
      ctx.beginPath();
      // ctx.ellipse(100, 100, 50, 75, 0, 0, 2 * Math.PI);
      debugger;
      ctx.ellipse(this.center.x, this.center.y, this.radiusX, this.radiusY, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // draw circle
      ctx.beginPath();
      ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  getMinMaxY() {
    const min = this.center.y - this.radius;
    const max = this.center.y + this.radius;
    return { min, max };
  }

  getMinMaxX() {
    const min = this.center.x - this.radius;
    const max = this.center.x + this.radius;
    return { min, max };
  }

  scale(x, y, sx, sy) {
    const pointsToScale = [this.center];
    let result = doScale(pointsToScale, x, y, sx, sy);
    //update points with new values
    this.center = result[0];
    this.radius *= sx;
  }

  //TODO: duplicate code - refactor matrixs of points
  mirror(axis = 'y') {
    const pointsToMirror = [this.center];
    let result = doMirror(pointsToMirror, axis);
    //update points with new values
    this.center = result[0];
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
  }

  mapping(sx, sy, wxl, wyb, vxl, vyb) {
    debugger;
    const pointsToMap = [this.center];
    let result = doMapping(pointsToMap, sx, sy, wxl, wyb, vxl, vyb);
    this.center = result[0];
    this.radius *= sx;
  }

  shear(x1 = 0, x2 = 0) {
    debugger;
    const moveBy = (x2 - x1) * 1;
    const shearMatrix = math.matrix([
      [1, 0, 0],
      [moveBy, 1, 0],
      [0, 0, 1],
    ]);
    // const leftMatrix = math.matrix([this.center.x - this.radius, this.center.y, 1]);
    const topMatrix = math.matrix([this.center.x, this.center.y + this.radius, 1]);
    const rightMatrix = math.matrix([this.center.x + this.radius, this.center.y, 1]);
    // const bottomMatrix = math.matrix([this.center.x, this.center.y - this.radius, 1]);
    const centerMatrix = math.matrix([this.center.x, this.center.y, 1]);

    // let result = math.multiply(leftMatrix, shearMatrix);
    // this.left.x = result._data[0];
    // this.left.y = result._data[1];

    let result = math.multiply(topMatrix, shearMatrix);
    this.top.x = result._data[0];
    this.top.y = result._data[1];

    result = math.multiply(rightMatrix, shearMatrix);
    this.right.x = result._data[0];
    this.right.y = result._data[1];

    // let result = math.multiply(bottomMatrix, shearMatrix);
    // this.bottom.x = result._data[0];
    // this.bottom.y = result._data[1];

    result = math.multiply(centerMatrix, shearMatrix);
    this.center.x = result._data[0];
    this.center.y = result._data[1];

    this.radiusX = Number(math.distance([this.center.x, this.center.y], [this.top.x, this.top.y]));
    this.radiusY = Number(math.distance([this.center.x, this.center.y], [this.right.x, this.right.y]));

    var dy = this.top.y - this.right.y;
    var dx = this.top.x - this.right.x;
    this.rotation = Math.atan2(dy, dx);

    this.isEllipse = true;
    this.degree = moveBy;
  }
}
