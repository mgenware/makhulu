const mkl = require('../..');

// creates a promise that will be resolved after given delay
function makePromise(name, delay) {
  return new Promise((resolve) => {
    console.log(`${name} started`);
    setTimeout(() => {
      console.log(`${name} completed`);
      resolve(name);
    }, delay);
  });
}

const task = new mkl.Task()
  .mapAsync('Create an array of Promises', (value) => {
    return makePromise(value, value);
  })
  .print()
  .mapSync('Add return values by 1', (value) => {
    return value - 1;
  })
  .print()
  .filterSync('Filter out all return values less than 1000', (value) => {
    return value < 1000;
  })
  .print();

task.runWithArray([2000, 200, 2]);
console.log('Task started');
