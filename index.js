let editor = null;
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.transform(1, 0, 0, -1, 0, canvas.height);
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
  try {
    console.log('load image!!!');
    editor = null;
    const textLines = textData.trim().split('\n');
    const graphics = textLines.map((line) => parseLine(line));
    editor = new Editor(canvas, graphics);
  } catch (error) {
    globalThis.document.querySelector('#error').innerText = error.message;
    return;
  }
}

/**
 * parse string line to get the values and the type of the shape
 * @param {string} line - a line from the user text file
 * @return {values<number[]>, shape<string>} graphic - represent graphic object to draw
 */
function parseLine(line) {
  line = line.replace('(', '');
  line = line.replace(')', '');
  const values = line.split(',');
  const shape = values.pop();
  const isValid = validation(values, shape);
  if (!isValid) throw Error('Bad input file...');
  return { values, shape };
}

/**
 * validate that user input files are valid
 * @param {*} values - represent points that will create graphic object
 * @param {*} shape - type of shape to draw
 */
function validation(values, shape) {
  //validate that values are exist
  if (values == false || values.length === 0) return false;

  values.forEach((value) => {
    const num = Number(value);
    if (typeof num != 'number') throw Error('input values for shape should be a numbers...');
    if (num % 1 !== 0) throw Error('input values for shape should be integer...');
  });
  //validate that shape is one of the following
  if (!shape) return false;
  if (shape !== 'A' && shape !== 'B' && shape !== 'C') throw Error('shape input from file is invalid...');

  return true;
}
