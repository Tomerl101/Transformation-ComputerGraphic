function doShear(points, x1, x2) {
  const moveBy = (x2 - x1) / 100;
  const shearMatrix = math.matrix([
    [1, 0, 0],
    [moveBy, 1, 0],
    [0, 0, 1],
  ]);

  const newPoints = points.map((point) => {
    const pointMatrix = math.matrix([point.x, point.y, 1]);
    const { _data } = math.multiply(pointMatrix, shearMatrix);
    return { x: _data[0], y: _data[1] };
  });

  return newPoints;
}
