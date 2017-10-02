import * as ma from '../lib/main';
import * as assert from 'assert';

describe('JS Factory', () => {
  it('array', () => {
    const array = [1, 4, 6, -4, 3];
    const task = ma.js.array(array);
    assert.equal(task.states.length, array.length);
    for (let i = 0; i < task.states.length; i++) {
      assert.equal(task.states[i].data, array[i]);
    }
  });
})
