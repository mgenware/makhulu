import * as ma from '../lib/main';
import * as assert from 'assert';
const VALUES = [1, 4, 7, 2, -5];
const INDICES = [0, 1, 2, 3, 4];

function createTask() {
  const task = ma.js.array(VALUES);
  task.setReporter(null);
  return task;
}
function arrayToMap(array: number[]): { [key: number]: boolean } {
  const map: { [key: number]: boolean } = {};
  for (const n of array) {
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

const VALUES_MAP = arrayToMap(VALUES);
const INDICES_MAP = arrayToMap(INDICES);

describe('Task.map', () => {
  it('map should iterate through all current values', (done) => {
    const task = createTask();
    const valuesMap: { [key: string]: boolean } = {};
    const indicesMap: { [key: number]: boolean } = {};
    task.map('', (value: any, state: ma.State, index: number) => {
      valuesMap[value] = true;
      indicesMap[index] = true;

      assert.equal(state.data, value);
      return value;
    }).then('', () => {
      assert.deepEqual(valuesMap, VALUES_MAP);
      assert.deepEqual(indicesMap, INDICES_MAP);
      done();
    });
  });

  it('Check return values of map', (done) => {
    const task = createTask();
    task.map('', (value: number) => {
      return value + 1;
    }).then('', (states) => {
      assert.deepEqual(states.map((s) => s.data), VALUES.map((i) => i + 1));
      done();
    });
  });
});

// describe('Task.filter', () => {
//   it('filter should iterate through all current values', (done) => {
//     const task = createTask();
//     const values: { [key: string]: boolean } = {};
//     const indices: { [key: number]: boolean } = {};
//     task.filter('', (value: any, state: ma.State, index: number) => {
//       values[value] = true;
//       indices[index] = true;
//       assert.equal(state.data, value);
//       return true;
//     }).then('', () => {
//       assert.deepEqual(values, arrayToMap(VALUES));
//       done();
//     });
//   });

//   it('Check return values of filter', (done) => {
//     const task = createTask();
//     const values: { [key: string]: boolean } = {};
//     const indices: { [key: number]: boolean } = {};
//     task.filter('', (value: number) => {
//       return value < 0;
//     }).then('', (prev) => {
//       assert.deepEqual(values, [-5]);
//       done();
//     });
//   });
// });

describe('Task.then', () => {
  it('then should reflect task\'s values and states', (done) => {
    const task = createTask();
    task.then('', (states) => {
      assertStates(states.map((s) => s.data), states, VALUES);
    }).then('', () => {
      done();
    });
  });
  it('Return undefined', (done) => {
    const task = createTask();
    // tslint:disable-next-line: no-empty
    task.then('', () => { }).then('', (states) => {
      assertStates(states.map((s) => s.data), states, VALUES);
      done();
    });
  });
  it('Return another set of states', (done) => {
    const task = createTask();
    task.then('', (states) => {
      return states.filter((s) => s.data < 0);
    }).then('', (states) => {
      assert.deepEqual(states.map((s) => s.data), [-5]);
      done();
    });
  });
});
