import test from 'node:test';
import assert from 'node:assert/strict';
import { projectAtScroll, projectScrollOffset } from '../app/project-scroll.mjs';

test('entry and exit keep the first and last projects without looping', () => {
  assert.equal(projectAtScroll(-900, 3600, 7), 0);
  assert.equal(projectAtScroll(0, 3600, 7), 0);
  assert.equal(projectAtScroll(3600, 3600, 7), 6);
  assert.equal(projectAtScroll(5000, 3600, 7), 6);
});
test('forward and reverse scrolling select the same project at the same position', () => {
  for (const index of [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]) {
    assert.equal(projectAtScroll(index * 600, 3600, 7), index);
  }
});
test('direct selection and native scroll agree at different viewport sizes', () => {
  for (const travel of [2592, 3240, 3888]) {
    for (let i = 0; i < 7; i++) assert.equal(projectAtScroll(projectScrollOffset(i, travel, 7), travel, 7), i);
  }
});
test('small scrolls preserve the selected project until the next midpoint', () => {
  assert.equal(projectAtScroll(299, 3600, 7), 0);
  assert.equal(projectAtScroll(301, 3600, 7), 1);
});
test('empty tracks, a single project, and out-of-range selections are safe', () => {
  assert.equal(projectAtScroll(100, 0, 7), 0);
  assert.equal(projectScrollOffset(0, 3600, 1), 0);
  assert.equal(projectScrollOffset(-1, 3600, 7), 0);
  assert.equal(projectScrollOffset(20, 3600, 7), 3600);
});
