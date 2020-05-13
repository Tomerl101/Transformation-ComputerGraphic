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
}
