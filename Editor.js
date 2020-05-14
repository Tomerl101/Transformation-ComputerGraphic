const SHAPE_TYPE = { LINE: 'A', CIRCLE: 'B', CURVE: 'C' };

/**
 * The Editor class manage hold the graphics given by the user from .txt file
 * The Editor is also responsible for the image manipulations
 * math matrices docs : https://mathjs.org/docs/datatypes/matrices.html
 */
class Editor {
  constructor(canvas, graphics) {
    console.log('initialize Editor...');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.graphics = this.setGraphics(graphics);
    this.minY = null;
    this.maxY = null;
    this.minX = null;
    this.maxX = null;
    this.center = null;
    this.anchorX = null;
    this.anchorY = null;

    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
    this.drawGraphics();

    this.canvas.addEventListener('click', this.mirror.bind(this));
    globalThis.document.querySelector('#mirrorX').addEventListener('click', () => this.mirror('x'));
    globalThis.document.querySelector('#mirrorY').addEventListener('click', () => this.mirror('y'));
    globalThis.document
      .querySelector('#doTranslate')
      .addEventListener('click', this.onClickTranslate.bind(this));
  }

  setGraphics(graphics) {
    return graphics.map((graphic) => this.createGraphic(graphic));
  }

  drawGraphics() {
    this.clearCanvas();
    this.graphics.forEach((graphic) => graphic.draw(this.ctx));
  }

  clearCanvas() {
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCenter() {
    const x = (this.maxX + this.minX) / 2;
    const y = (this.maxY + this.minY) / 2;
    return { x, y };
  }

  /**
   * save the highest and lowset points of the image  (maxY and minY)
   * this will help us to set anchor at the lowest point of the image
   */
  setMinMaxY() {
    this.minY = null; //reset values because we want to find the new relative min
    this.maxY = null; //reset values because we want to find the new relative min
    this.graphics.forEach((graphic) => {
      const { min, max } = graphic.getMinMaxY();
      this.minY = this.minY === null ? min : min < this.minY ? min : this.minY;
      this.maxY = this.maxY === null ? max : max > this.maxY ? max : this.maxY;
    });
    this.anchorY = this.minY;
  }

  /**
   * save the most left and and most right points of the image  (maxX and minX)
   * this will help us to set anchor at the most right point of the image
   */
  setMinMaxX() {
    this.minX = null; //reset values because we want to find the new relative max
    this.maxX = null; //reset values because we want to find the new relative max
    this.graphics.forEach((graphic) => {
      const { min, max } = graphic.getMinMaxX();
      this.minX = this.minX === null ? min : min < this.minX ? min : this.minX;
      this.maxX = this.maxX === null ? max : max > this.maxX ? max : this.maxX;
    });
    this.anchorX = this.minX;
  }

  /**
   * create new instance of the graphic specified in the user file
   * @param {*} graphic
   * @returns Line | Circle | Curve
   */
  createGraphic(graphic) {
    //TODO: refactor to factory patten
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
   * mirrior all the graphic objects and when done
   * translate their position relative to the anchor in the selected axis
   * @param {string} axis - the direction in which to do the mirroring
   */
  mirror(axis) {
    let translate;
    if (axis === 'y') translate = [this.center.x * 2, 0];
    if (axis === 'x') translate = [0, this.center.y * 2];

    this.graphics.forEach((graphic) => graphic.mirror(axis));
    this.translate(...translate);
    this.clearCanvas();
    this.drawGraphics();
  }

  /**
   * translate the position of the graphics objects
   * @param {Number} x - how much to move in the x axis
   * @param {Number} y - how much to move in the y axis
   */
  translate(x, y) {
    this.graphics.forEach((graphic) => graphic.translate(x, y));
    this.clearCanvas();
    this.drawGraphics();
  }

  onClickTranslate() {
    //get values from the translate inputs
    const x = Number(globalThis.document.querySelector('#translateX').value) || 0;
    const y = Number(globalThis.document.querySelector('#translateY').value) || 0;
    this.translate(x, y);
    //recalculate the new minmax bounderies of the image after the translate
    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
  }
}
