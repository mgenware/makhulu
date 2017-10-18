import * as ma from '../lib/main';
import * as assert from 'assert';

describe('Factory.JS', () => {
  it('array', () => {
    const array = [1, 4, 6, -4, 3];
    const states = ma.js.array(array);
    assert.deepEqual(states.map((s) => s.data), array);
  });
});
