import * as mkl from '../lib/main';
import * as assert from 'assert';
const VALUES = [1, 4, 7, 2, -5];
const INDICES = [0, 1, 2, 3, 4];

function createTask(): mkl.Task {
  const task = new mkl.Task();
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
function makePromise(ret: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ret);
    }, 200);
  });
}

const INDICES_MAP = arrayToMap(INDICES);

describe('Task.mapSync', () => {
  it('Values and indices', (done) => {
    const task = createTask();
    const idxMap: { [key: number]: boolean } = {};
    task.mapSync('', (value: number, index: number) => {
      idxMap[index] = true;
      return value + 1;
    }).then('', (array) => {
      assert.deepEqual(array, VALUES.map((i) => i + 1));
      assert.deepEqual(idxMap, INDICES_MAP);
      done();
      return array;
    });
    task.runWithArray(VALUES);
  });
});

describe('Task.mapSeries', () => {
  it('Values and indices', (done) => {
    const task = createTask();
    const idxMap: { [key: number]: boolean } = {};
    task.mapSeries('', (value: number, index: number) => {
      idxMap[index] = true;
      return makePromise(value + 1);
    }).then('', (array) => {
      assert.deepEqual(array, VALUES.map((i) => i + 1));
      assert.deepEqual(idxMap, INDICES_MAP);
      done();
      return array;
    });
    task.runWithArray(VALUES);
  });
});

describe('Task.mapAsync', () => {
  it('Values and indices', (done) => {
    const task = createTask();
    const idxMap: { [key: number]: boolean } = {};
    task.mapAsync('', (value: number, index: number) => {
      idxMap[index] = true;
      return makePromise(value + 1);
    }).then('', (array) => {
      assert.deepEqual(array, VALUES.map((i) => i + 1));
      assert.deepEqual(idxMap, INDICES_MAP);
      done();
      return array;
    });
    task.runWithArray(VALUES);
  });
});

describe('Task.filterSync', () => {
  it('filterSync', (done) => {
    const task = createTask();
    const idxMap: { [key: number]: boolean } = {};
    task.filterSync('', (value: number, index: number) => {
      idxMap[index] = true;
      return value < 0;
    }).then('', (values) => {
      assert.deepEqual(values, [-5]);
      assert.deepEqual(idxMap, INDICES_MAP);
      done();
      return values;
    });
    task.runWithArray(VALUES);
  });
});

describe('Task.filterAsync', () => {
  it('filterAsync', (done) => {
    const task = createTask();
    const idxMap: { [key: number]: boolean } = {};
    task.filterAsync('', async (value: number, index: number) => {
      idxMap[index] = true;
      return makePromise(value < 0);
    }).then('', (values) => {
      assert.deepEqual(values, [-5]);
      assert.deepEqual(idxMap, INDICES_MAP);
      done();
      return values;
    });
    task.runWithArray(VALUES);
  });
});

describe('Task.then', () => {
  it('then', (done) => {
    const task = createTask();
    task.then('', (values) => {
      return values.filter((v) => v < 0);
    }).then('', (values) => {
      assert.deepEqual(values, [-5]);
      done();
      return values;
    });
    task.runWithArray(VALUES);
  });
});
