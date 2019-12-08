import * as mk from '../';
import * as assert from 'assert';

mk.setLoggingEnabled(false);

it('sleep', async () => {
  assert.equal(typeof mk.sleep, 'function');
});

it('count', async () => {
  assert.deepEqual(await mk.count(3).list, [
    { index: 0 },
    { index: 1 },
    { index: 2 },
  ]);
  assert.deepEqual(await mk.count(3, -3).list, [
    { index: -3 },
    { index: -2 },
    { index: -1 },
  ]);
});
