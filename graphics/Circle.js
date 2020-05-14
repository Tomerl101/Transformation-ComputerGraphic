class Circle {
  constructor(centerX, centerY, radius, fill = '') {
    console.log('create new circle...');
    this.center = { x: Number(centerX), y: Number(centerY) };
    this.radius = radius;
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
}
