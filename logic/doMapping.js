function doMapping(points, sx, sy, wxl, wyb, vxl, vyb) {
  const newPoints = points.map((point) => {
    const x = sx * (point.x - wxl) + vxl;
    const y = sy * (point.y - wyb) + vyb;
    return { x, y };
  });

  return newPoints;
}
