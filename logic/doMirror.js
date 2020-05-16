function doMirror(points, axis) {
  const axisX = axis === 'x' ? -1 : 1;
  const axisY = axis === 'y' ? -1 : 1;
  const mirrorMatrix = math.matrix([
    [axisY, 0, 0],
    [0, axisX, 0],
    [0, 0, 1],
  ]);

  const newPoints = points.map((point) => {
    const pointMatrix = [point.x, point.y, 1];
    const { _data } = math.multiply(pointMatrix, mirrorMatrix);
    return { x: _data[0], y: _data[1] };
  });

  return newPoints;
}
