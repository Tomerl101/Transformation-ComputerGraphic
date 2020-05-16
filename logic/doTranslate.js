function doTranslate(points, x, y) {
  const translateMatrix = math.matrix([
    [1, 0, 0],
    [0, 1, 0],
    [x, y, 1],
  ]);

  const newPoints = points.map((point) => {
    const pointMatrix = math.matrix([point.x, point.y, 1]);
    const { _data } = math.multiply(pointMatrix, translateMatrix);
    return { x: _data[0], y: _data[1] };
  });

  return newPoints;
}
