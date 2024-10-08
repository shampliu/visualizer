export default function getViewportHeight(
  depth, // include camera offset
  fov
) {
  // vertical fov in radians
  const vFOV = (fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}
