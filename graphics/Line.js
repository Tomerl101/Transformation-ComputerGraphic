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

  //TODO: duplicate code - refactor matrixs of points
  mirror(axis = 'y') {
    const axisX = axis === 'x' ? -1 : 1;
    const axisY = axis === 'y' ? -1 : 1;
    const p1matrix = math.matrix([this.p1.x, this.p1.y, 1]);
    const p2matrix = math.matrix([this.p2.x, this.p2.y, 1]);
    const mirrorMatrix = math.matrix([
      [axisY, 0, 0],
      [0, axisX, 0],
      [0, 0, 1],
    ]);

    let result = math.multiply(p1matrix, mirrorMatrix);
    this.p1.x = result._data[0];
    this.p1.y = result._data[1];

    result = math.multiply(p2matrix, mirrorMatrix);
    this.p2.x = result._data[0];
    this.p2.y = result._data[1];
  }

  translate(x = 0, y = 0) {
    const p1matrix = math.matrix([this.p1.x, this.p1.y, 1]);
    const p2matrix = math.matrix([this.p2.x, this.p2.y, 1]);
    const translateMatrix = math.matrix([
      [1, 0, 0],
      [0, 1, 0],
      [x, y, 1],
    ]);

    let result = math.multiply(p1matrix, translateMatrix);
    this.p1.x = result._data[0];
    this.p1.y = result._data[1];

    result = math.multiply(p2matrix, translateMatrix);
    this.p2.x = result._data[0];
    this.p2.y = result._data[1];
  }
}
