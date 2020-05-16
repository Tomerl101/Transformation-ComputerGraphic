const SHAPE_TYPE = { LINE: 'A', CIRCLE: 'B', CURVE: 'C' };

/**
 * The Editor class hold the graphic objects given by the user from .txt file
 * The Editor is also responsible for the image manipulations
 * math matrices docs : https://mathjs.org/docs/datatypes/matrices.html
 */
class Editor {
  constructor(canvas, graphics) {
    console.log('initialize Editor...');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isDrawing = false;
    this.graphics = null;
    this.minY = null;
    this.maxY = null;
    this.minX = null;
    this.maxX = null;
    this.center = null;
    this.anchorX = null;
    this.anchorY = null;

    this.mouseX = 0;
    this.mouseY = 0;

    debugger;
    this.setGraphics(graphics);
    this.setMinMaxY();
    this.setMinMaxX();
    this.initButtonListeners();
    this.center = this.getCenter();
    this.drawGraphics();

    // this.canvas.addEventListener('mousedown', (e) => {
    //   this.mouseX = e.offsetX;
    //   this.mouseY = e.offsetY;
    //   this.isDrawing = true;
    // });

    // this.canvas.addEventListener('mousemove', (e) => {
    //   if (this.isDrawing === true) {
    //     this.shear(e.offsetX, this.canvas.height - e.offsetY);

    //     this.mouseX = e.offsetX;
    //     this.mouseY = e.offsetY;
    //   }
    // });

    // this.canvas.addEventListener('mouseup', (e) => {
    //   if (this.isDrawing === true) {
    //     // drawLine(context, x, y, e.offsetX, e.offsetY);
    //     this.mouseX = 0;
    //     this.mouseY = 0;
    //     this.isDrawing = false;
    //   }
    // });
  }

  setGraphics(graphics) {
    this.graphics = graphics.map((graphic) => this.GraphicFactory(graphic));
  }

  initButtonListeners() {
    globalThis.document.querySelector('#doScale').addEventListener('click', this.onClickScale.bind(this));
    globalThis.document.querySelector('#mirrorX').addEventListener('click', () => this.mirror('x'));
    globalThis.document.querySelector('#mirrorY').addEventListener('click', () => this.mirror('y'));
    globalThis.document.querySelector('.rotate').addEventListener('click', () => this.onClickRotate());
    globalThis.document
      .querySelector('#doTranslate')
      .addEventListener('click', this.onClickTranslate.bind(this));
  }

  drawGraphics() {
    this.clearCanvas();
    this.graphics.forEach((graphic) => graphic.draw(this.ctx));
  }

  clearCanvas() {
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * get the center point of the image
   * (not the center of the canvas!)
   */
  getCenter() {
    const x = (this.maxX + this.minX) / 2;
    const y = (this.maxY + this.minY) / 2;
    return { x, y };
  }

  /**
   * save the top bound and lowset bound of the image  (maxY and minY)
   * this will help us to set anchor at the lowest point of the image
   */
  setMinMaxY() {
    //reset values because we want to find the new relative min/max of the image
    this.minY = null;
    this.maxY = null;
    this.graphics.forEach((graphic) => {
      const { min, max } = graphic.getMinMaxY();
      this.minY = this.minY === null ? min : min < this.minY ? min : this.minY;
      this.maxY = this.maxY === null ? max : max > this.maxY ? max : this.maxY;
    });
    this.anchorY = this.minY;
  }

  /**
   * save left bound and right bound position of the image (maxX and minX)
   * this will help us to set anchor at the most right point of the image
   */
  setMinMaxX() {
    //reset values because we want to find the new relative min/max of the image
    this.minX = null;
    this.maxX = null;
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
  GraphicFactory(graphic) {
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

  scale(scaleX, scaleY) {
    this.graphics.forEach((graphic) => graphic.scale(this.center.x, this.center.y, scaleX, scaleY));
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

  /**
   * rotate image given by user selected degree
   * the rotate function first translate the image to the center of the axis
   * perform the rotation on every graphics object that compose the image
   * and finally translate the image back to it original point (the center of the image)
   * @param {Number} degree - positive value rotate right, negative left.
   */
  rotate(degree) {
    this.graphics.forEach((graphic) => graphic.rotate(this.center.x, this.center.y, degree));
    this.clearCanvas();
    this.drawGraphics();
  }

  shear(x, y) {
    //do shear only if user clicked inside the boundries of the image
    if (this.minY < y) {
      debugger;
      this.translate(-this.minX, -this.minY);
      this.graphics.forEach((graphic) => graphic.shear(this.mouseX, x));
      this.translate(this.minX, this.minY);
      this.clearCanvas();
      this.drawGraphics();
    }
  }

  onClickTranslate() {
    debugger;
    //get values from the translate inputs
    const x = Number(globalThis.document.querySelector('#translateX').value) || 0;
    const y = Number(globalThis.document.querySelector('#translateY').value) || 0;
    this.translate(x, y);
    //recalculate the new minmax bounderies of the image after translate
    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
  }

  onClickRotate() {
    //get values from the translate inputs
    const degree = -Number(globalThis.document.querySelector('#rotationDegree').value) || 0;
    this.rotate(degree);
  }

  onClickScale() {
    //get values from the translate inputs
    const scaleX = Number(globalThis.document.querySelector('#scaleX').value) || 0;
    const scaleY = Number(globalThis.document.querySelector('#scaleY').value) || 0;

    //cannot scale by negative number
    if (scaleX <= 0 || scaleY <= 0) return;

    this.scale(scaleX, scaleY);
    //recalculate the new minmax bounderies of the image after translate
    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
  }
}
