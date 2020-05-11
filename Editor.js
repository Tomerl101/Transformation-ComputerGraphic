const SHAPE_TYPE = { LINE: 'A', CIRCLE: 'B', CURVE: 'C' };

/**
 * The Editor class manage hold the graphics given by the user from .txt file
 * The Editor is also responsible for the image manipulations
 */
class Editor {
  constructor(canvas, graphics) {
    console.log('initialize Editor...');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.graphics = this.setGraphics(graphics);

    this.drawGraphics();
  }

  setGraphics(graphics) {
    return graphics.map((graphic) => this.createGraphic(graphic));
  }

  /**
   * create new instance of the graphic specified in the user file
   * @param {*} graphic
   * @returns Line | Circle | Curve
   */
  createGraphic(graphic) {
    if (graphic.shape === SHAPE_TYPE.LINE) {
      return new Line(...graphic.values);
    }
    if (graphic.shape === SHAPE_TYPE.CIRCLE) {
      return new Circle(...graphic.values);
    }
    if (graphic.shape === SHAPE_TYPE.CURVE) {
      return new Curve(...graphic.values);
    }
  }

  /**
   * draw graphics from user file to the canvas
   */
  drawGraphics() {
    this.graphics.forEach((graphic) => graphic.draw(this.ctx));
  }
}
