import test from 'node:test';
import assert from 'node:assert/strict';
import { relativePosition, wheelPosition, wrapIndex } from '../app/wheel-math.mjs';

test('the first and last projects wrap in both directions', () => {
  assert.equal(wrapIndex(7, 7), 0);
  assert.equal(wrapIndex(-1, 7), 6);
  assert.equal(wrapIndex(70001, 7), 1);
});
test('selection takes the shortest route through the loop', () => {
  assert.equal(relativePosition(6, 0, 7), -1);
  assert.equal(relativePosition(0, 6, 7), 1);
  assert.equal(relativePosition(3, 0, 7), 3);
});
test('previous and next align to the right of the active project', () => {
  const active = wheelPosition(0, 0, 7);
  const previous = wheelPosition(6, 0, 7);
  const next = wheelPosition(1, 0, 7);
  assert.ok(parseFloat(previous.left) > parseFloat(active.left));
  assert.ok(Math.abs(parseFloat(previous.left) - parseFloat(next.left)) < 0.001);
  assert.ok(parseFloat(previous.top) < parseFloat(active.top));
  assert.ok(parseFloat(next.top) > parseFloat(active.top));
  assert.ok(active.scale > previous.scale);
  assert.ok(active.opacity > previous.opacity);
});
test('advancing moves the current project up and the next into focus', () => {
  const oldActive = wheelPosition(0, 1, 7);
  const newActive = wheelPosition(1, 1, 7);
  assert.ok(parseFloat(oldActive.top) < parseFloat(newActive.top));
  assert.ok(Math.abs(parseFloat(newActive.top) - 50) < 0.001);
  assert.equal(newActive.scale, 1);
});
test('positions are identical after complete turns', () => {
  for (let index = 0; index < 7; index++) {
    assert.deepEqual(wheelPosition(index, 0, 7), wheelPosition(index, 7 * 200, 7));
  }
});
