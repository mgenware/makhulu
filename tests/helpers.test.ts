import * as mk from '../';

test('sleep', async () => {
  expect(typeof mk.sleep).toBe('function');
});

test('count', async () => {
  expect(await mk.count(4)).toEqual([0, 1, 2, 3]);
  expect(await mk.count(4, -3)).toEqual([-3, -2, -1, 0]);
});
