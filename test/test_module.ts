const main = require('../..');
import * as assert from 'assert';

describe('require this module', () => {
  it('No exception is thrown', () => {
    assert.doesNotThrow(() => {
      const task = main.js.array([]);
      assert.notEqual(task.reporter, null);
    });
  });
});
