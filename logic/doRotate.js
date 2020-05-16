function doRotate(points, cx, cy, angle) {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const newPoints = points.map((point) => {
    const dx = point.x - cx;
    const dy = point.y - cy;
    const x = cos * dx - sin * dy + cx;
    const y = sin * dx + cos * dy + cy;
    return { x, y };
  });

  return newPoints;
}
