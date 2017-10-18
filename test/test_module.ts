const mkl = require('../..');
import * as assert from 'assert';

describe('require this module', () => {
  it('No exception is thrown', () => {
    assert.equal(typeof mkl.js.array, 'function');
  });
});
