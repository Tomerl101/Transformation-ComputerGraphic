function doScale(points, x, y, sx, sy) {
  const newPoints = points.map((point) => {
    const dx = point.x - x;
    const dy = point.y - y;
    const _x = sx * dx + x;
    const _y = sy * dy + y;
    return { x: _x, y: _y };
  });

  return newPoints;
}
