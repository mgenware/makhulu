import * as mk from '../';

mk.setLoggingEnabled(false);

test('sleep', async () => {
  expect(typeof mk.sleep).toBe('function');
});

test('count', async () => {
  expect(await mk.count(3).list).toEqual([
    { index: 0 },
    { index: 1 },
    { index: 2 },
  ]);
  expect(await mk.count(3, -3).list).toEqual([
    { index: -3 },
    { index: -2 },
    { index: -1 },
  ]);
});
