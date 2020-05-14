class Circle {
  constructor(centerX, centerY, radius, fill = '') {
    console.log('create new circle...');
    this.center = { x: Number(centerX), y: Number(centerY) };
    this.radius = Number(radius);
    this.fill = fill;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  getMinMaxY() {
    const min = this.center.y + this.radius;
    const max = this.center.y - this.radius;
    return { min, max };
  }

  getMinMaxX() {
    const min = this.center.x + this.radius;
    const max = this.center.x - this.radius;
    return { min, max };
  }

  //TODO: duplicate code - refactor matrixs of points
  mirror(axis = 'y') {
    const axisX = axis === 'x' ? -1 : 1;
    const axisY = axis === 'y' ? -1 : 1;
    const centerMatrix = math.matrix([this.center.x, this.center.y, 1]);
    const mirrorMatrix = math.matrix([
      [axisY, 0, 0],
      [0, axisX, 0],
      [0, 0, 1],
    ]);

    let result = math.multiply(centerMatrix, mirrorMatrix);
    this.center.x = result._data[0];
    this.center.y = result._data[1];
  }

  translate(x = 0, y = 0) {
    const centerMatrix = math.matrix([this.center.x, this.center.y, 1]);
    const translateMatrix = math.matrix([
      [1, 0, 0],
      [0, 1, 0],
      [x, y, 1],
    ]);

    let result = math.multiply(centerMatrix, translateMatrix);
    this.center.x = result._data[0];
    this.center.y = result._data[1];
  }
}
