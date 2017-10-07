import * as ma from '../lib/main';
import * as assert from 'assert';
const VALUES = [1, 4, 7, 2, -5];

function createTask() {
  const task = ma.js.array(VALUES);
  task.setReporter(null);
  return task;
}
function arrayToMap(array: number[]): { [key: number]: boolean } {
  const map: { [key: number]: boolean } = {};
  for (let n of array) {
    map[n] = true;
  }
  return map;
}

function assertStates(values: any, states: ma.State[], expectedValues: any[]) {
  assert.deepEqual(values, expectedValues);
  for (let i = 0; i < expectedValues.length; i++) {
    assert.equal(expectedValues[i], states[i].data);
  }
}

describe('Task.map', () => {
  it('map should iterate through all current values', (done) => {
    const task = createTask();
    const values: { [key: string]: boolean } = {};
    const indices: { [key: number]: boolean } = {};
    task.map('', (value: any, index: number, state: ma.State) => {
      values[value] = true;
      indices[index] = true;
      assert.equal(state.data, value);
    }).then('', () => {
      assert.deepEqual(values, arrayToMap(VALUES));
      done();
    });
  });

  it('Check return values of map', (done) => {
    const task = createTask();
    const values: { [key: string]: boolean } = {};
    const indices: { [key: number]: boolean } = {};
    task.map('', (value: number) => {
      return value + 1;
    }).then('', (values) => {
      assert.deepEqual(values, VALUES.map(i => i + 1));
      done();
    });
  });
});

describe('Task.filter', () => {
  it('filter should iterate through all current values', (done) => {
    const task = createTask();
    const values: { [key: string]: boolean } = {};
    const indices: { [key: number]: boolean } = {};
    task.filter('', (value: any, index: number, state: ma.State) => {
      values[value] = true;
      indices[index] = true;
      assert.equal(state.data, value);
      return true;
    }).then('', () => {
      assert.deepEqual(values, arrayToMap(VALUES));
      done();
    });
  });

  it('Check return values of filter', (done) => {
    const task = createTask();
    const values: { [key: string]: boolean } = {};
    const indices: { [key: number]: boolean } = {};
    task.filter('', (value: number) => {
      return value < 0;
    }).then('', (values) => {
      assert.deepEqual(values, [-5]);
      done();
    });
  });
});

describe('Task.then', () => {
  it('then should reflect task\'s values and states', (done) => {
    const task = createTask();
    task.then('', (values, states) => {
      assertStates(values, states, VALUES);
    }).then('', () => {
      done();
    });
  });
  it('Return undefined', (done) => {
    const task = createTask();
    let currentValues: number[] = [];
    task.then('', (values, states) => {
      currentValues = values;
    }).then('', (values) => {
      assert.deepEqual(values, currentValues);
      done();
    });
  });
  it('Return another set of states', (done) => {
    const task = createTask();
    const sampleValue = [4, 5, 6];
    task.then('', (values, states) => {
      return states.filter(s => s.data < 0);
    }).then('', (values) => {
      assert.deepEqual(values, [-5]);
      done();
    });
  });
});
