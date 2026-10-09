export function wrapIndex(value, count) {
  return ((value % count) + count) % count;
}

export function relativePosition(index, position, count) {
  return wrapIndex(index - position + count / 2, count) - count / 2;
}

export function wheelPosition(index, position, count) {
  const distance = relativePosition(index, position, count);
  const angle = Math.PI - distance * Math.PI / 3;
  return {
    left: `${102 + 70 * Math.cos(angle)}%`,
    top: `${50 + 38 * Math.sin(angle)}%`,
    scale: Math.max(0.46, 1 - Math.abs(distance) * 0.35),
    opacity: Math.max(0, 1 - Math.abs(distance) * 0.63),
    visible: Math.abs(distance) < 1.65,
  };
}
