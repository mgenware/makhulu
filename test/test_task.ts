import * as ma from '../lib/main';
import * as assert from 'assert';
const ARRAY = [1, 4, 7, 2, -5];

function createTask() {
  const task = ma.js.array(ARRAY);
  return task;
}
function arrayToMap(array: number[]): { [key: number]: boolean } {
  const map: { [key: number]: boolean } = {};
  for (let n of array) {
    map[n] = true;
  }
  return map;
}

describe('Task.arguments', () => {
  it('Arguments', (done) => {
    const task = createTask();
    const values: { [key: string]: boolean } = {};
    const indices: { [key: number]: boolean } = {};
    task.map((value: any, index: number, state: ma.State) => {
      values[value] = true;
      indices[index] = true;
      assert.equal(state.data, value);
    }).then(() => {
      assert.deepEqual(values, arrayToMap(ARRAY));
      done();
    });
  });
});

describe('Task.then', () => {
  it('prevValues', (done) => {
    const task = createTask();
    task.then((values, states) => {
      assert.deepEqual(values, task.states.map(state => state.data));
      assert.deepEqual(states, task.states);
    }).then(() => {
      done();
    });
  });
  it('return undefined', (done) => {
    const task = createTask();
    let prevValues: any[] = null;
    task.then((values, states) => {
      prevValues = values;
    }).then((values) => {
      assert.deepEqual(prevValues, values);
      done();
    });
  });
  it('return states', (done) => {
    const task = createTask();
    task.then((values, states) => {
      prevValues = values;
    }).then((values) => {
      assert.deepEqual(prevValues, values);
      done();
    });
  });
});
