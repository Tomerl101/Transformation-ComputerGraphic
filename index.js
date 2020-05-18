let editor = null;
//read file from user selected file
document.getElementById('fileInput').addEventListener('change', function selectedFileChanged() {
  if (this.files.length === 0) {
    console.log('No file selected.');
    return;
  }

  const reader = new FileReader();
  reader.readAsText(this.files[0]);

  // when the reader is done, the content is in reader.result.
  reader.onload = function fileReadCompleted() {
    let result = reader.result;
    loadGraphicsFile(result);
  };
});

/**
 * initalize the graphics from user text file into the Editor class
 * * @param {string} textData - the content of the user selected graphic file to draw
 */
function loadGraphicsFile(textData) {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.transform(1, 0, 0, -1, 0, canvas.height);
  editor = null;
  const textLines = textData.trim().split('\n');
  const graphics = textLines.map((line) => parseLine(line));
  editor = new Editor(canvas, graphics);
}

/**
 * parse string line to get the values and the type of the shape
 * @param {string} line - a line from the user text file
 * @return {values<number[]>, shape<string>} graphic - represent graphic object to draw
 */
function parseLine(line) {
  console.log('parsing line');
  //TODO: validate user input!!!
  line = line.replace('(', '');
  line = line.replace(')', '');
  const values = line.split(',');
  const shape = values.pop();
  return { values, shape };
}
