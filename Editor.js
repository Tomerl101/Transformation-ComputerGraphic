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
    this.isMouseDown = false;
    this.graphics = null;
    this.minY = null;
    this.maxY = null;
    this.minX = null;
    this.maxX = null;
    this.center = null;
    this.anchorX = null;
    this.anchorY = null;

    this.isTranslateBtnSelected = false;
    this.isShearingBtnSelected = false;

    this.mouseX = 0;
    this.mouseY = 0;

    try {
      this.setGraphics(graphics);
      this.setMinMaxY();
      this.setMinMaxX();
      this.center = this.getCenter();
      this.initButtonListeners();
      this.fitImageToViewport();
      this.drawGraphics();
      this.setErrorText('');
    } catch (error) {
      this.setErrorText(error.message);
      return;
    }

    //TODO: move into mouseDrag() function
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
      this.isMouseDown = true;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        if (this.isTranslateBtnSelected) {
          this.onMouseMoveTranslate(e);
          return;
        }
        if (this.isShearingBtnSelected) {
          this.onMouseMoveShear(e);
          return;
        }
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (this.isMouseDown === true) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;
      }
    });
  }

  setGraphics(graphics) {
    this.graphics = graphics.map((graphic) => this.GraphicFactory(graphic));
  }

  initButtonListeners() {
    globalThis.document.querySelector('#doScaleIn').addEventListener('click', this.onClickScaleIn.bind(this));
    globalThis.document
      .querySelector('#doScaleOut')
      .addEventListener('click', this.onClickScaleOut.bind(this));
    globalThis.document.querySelector('#mirrorX').addEventListener('click', () => this.mirror('x'));
    globalThis.document.querySelector('#mirrorY').addEventListener('click', () => this.mirror('y'));
    globalThis.document
      .querySelector('.rotateRight')
      .addEventListener('click', () => this.onClickRotateRight());
    globalThis.document
      .querySelector('.rotateLeft')
      .addEventListener('click', () => this.onClickRotateLeft());
    globalThis.document
      .querySelector('#doTranslate')
      .addEventListener('click', this.toggleTranslate.bind(this));
    globalThis.document
      .querySelector('#doShearing')
      .addEventListener('click', this.toggleShearing.bind(this));
    globalThis.document.querySelector('#clearCanvas').addEventListener('click', this.onClickClear.bind(this));
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
    if (graphic.shape === SHAPE_TYPE.LINE) {
      if (graphic.values.length != 4) throw Error('invalid line values...');
      return new Line(...graphic.values);
    }
    if (graphic.shape === SHAPE_TYPE.CIRCLE) {
      if (graphic.values.length != 3 || Number(graphic.values[graphic.values.length - 1]) <= 0)
        throw Error('invalid circle values...');
      return new Circle(...graphic.values);
    }
    if (graphic.shape === SHAPE_TYPE.CURVE) {
      if (graphic.values.length != 8) throw Error('invalid curve values...');
      return new Curve(...graphic.values);
    }
    throw Error('cannot create graphic, check input file...');
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
    this.drawGraphics();
  }

  scale(scaleX, scaleY) {
    this.graphics.forEach((graphic) => graphic.scale(this.center.x, this.center.y, scaleX, scaleY));
    this.drawGraphics();
  }

  /**
   * translate the position of the graphics objects
   * @param {Number} x - how much to move in the x axis
   * @param {Number} y - how much to move in the y axis
   */
  translate(x, y) {
    this.graphics.forEach((graphic) => graphic.translate(x, y));
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
    this.drawGraphics();
  }

  shear(x, y) {
    //do shear only if user clicked inside the boundries of the image
    if (this.minY < y) {
      this.translate(-this.minX, -this.minY);
      this.graphics.forEach((graphic) => graphic.shear(this.mouseX, x));
      this.translate(this.minX, this.minY);
      this.drawGraphics();
    }
  }

  /**
   *TODO: add explanation
   */
  fitImageToViewport() {
    let sx = (this.canvas.width - 0) / (this.maxX - this.minX);
    let sy = (this.canvas.height - 0) / (this.maxY - this.minY);
    this.graphics.forEach((graphic) => graphic.mapping(sx, sy, this.minX, this.minY, 0, 0));

    this.minX = 0;
    this.maxX = this.canvas.width;
    this.minY = 0;
    this.maxY = this.canvas.height;
    this.center = this.getCenter();
  }

  isPointInsideBoundries(x, y) {
    if (x < this.maxX && x > this.minX && y < this.maxY && y > this.minY) {
      return true;
    } else {
      return false;
    }
  }

  //-------- VIEW ------------
  onClickClear() {
    this.clearCanvas();
    this.graphics = [];
  }

  setErrorText(text) {
    globalThis.document.querySelector('#error').innerText = text;
  }

  toggleTranslate() {
    this.isTranslateBtnSelected = !this.isTranslateBtnSelected;
    globalThis.document.querySelector('#doTranslate').classList.toggle('active');
    globalThis.document.querySelector('#doShearing').classList.remove('active');
    this.isShearingBtnSelected = false;
  }

  toggleShearing() {
    this.isShearingBtnSelected = !this.isShearingBtnSelected;
    globalThis.document.querySelector('#doShearing').classList.toggle('active');
    globalThis.document.querySelector('#doTranslate').classList.remove('active');
    this.isTranslateBtnSelected = false;
  }

  onClickScaleOut() {
    const scaleX = 0.9;
    const scaleY = 0.9;
    this.scale(scaleX, scaleY);
    //recalculate the new minmax bounderies of the image after translate
    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
  }

  onClickScaleIn() {
    const scaleX = 1.1;
    const scaleY = 1.1;
    this.scale(scaleX, scaleY);
    //recalculate the new minmax bounderies of the image after translate
    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
  }

  onClickRotateRight() {
    const degree = -15;
    this.rotate(degree);
  }

  onClickRotateLeft() {
    const degree = 15;
    this.rotate(degree);
  }

  onMouseMoveTranslate(e) {
    const x = -(this.mouseX - e.offsetX);
    const y = 700 - e.offsetY - (700 - this.mouseY);
    this.translate(x, y);
    //recalculate the new minmax bounderies of the image after translate
    this.setMinMaxY();
    this.setMinMaxX();
    this.center = this.getCenter();
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
  }

  onMouseMoveShear(e) {
    this.shear(e.offsetX, this.canvas.height - e.offsetY);
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
  }
}
