// A finite track: the browser owns scrolling, including entry and exit.
export function projectAtScroll(offset, travel, count) {
  if (count <= 1 || travel <= 0) return 0;
  return Math.max(0, Math.min(count - 1, Math.round((offset / travel) * (count - 1))));
}

export function projectScrollOffset(index, travel, count) {
  if (count <= 1 || travel <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index)) * travel / (count - 1);
}
