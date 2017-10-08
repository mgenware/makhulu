import * as ma from '../lib/main';
import * as assert from 'assert';

describe('Factory.JS', () => {
  it('array', (done) => {
    const array = [1, 4, 6, -4, 3];
    const task = ma.js.array(array);
    task.setReporter(null);
    task.then('', (states) => {
      assert.deepEqual(states.map((s) => s.data), array);
      done();
    });
  });
});
