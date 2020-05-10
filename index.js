const SHAPES = { LINE: "A", CIRCLE: "B", CURVE: "C" };

//read file from user selected file
document
  .getElementById("fileInput")
  .addEventListener("change", function selectedFileChanged() {
    if (this.files.length === 0) {
      console.log("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      // when the reader is done, the content is in reader.result.
      let result = reader.result;
      var textLines = result.split("\n");

      textLines.forEach((line) => {
        const { shape, values } = parseLine(line);

        switch (shape) {
          case SHAPES.LINE:
            drawLine(values);
            break;
          case SHAPES.CIRCLE:
            drawCircle(values);
            break;
          case SHAPES.CURVE:
            drawCurve(values);
            break;
          default:
            //TODO: throw error - shape not supported!
            break;
        }
      });
    };
    reader.readAsText(this.files[0]);
  });

function drawLine(points) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(300, 150);
  ctx.stroke();
  console.log("draw line ", points);
}

function drawCircle(points) {}

function drawCurve(points) {}

function parseLine(line) {
  //TODO: validate user input!
  line = line.replace("(", "");
  line = line.replace(")", "");
  const values = line.split(",");
  const shape = values.pop();
  return { values, shape };
}
