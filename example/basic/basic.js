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

mkl.js.array([2000, 200, 2])
.map('Create an array of Promises', (n, index, state) => {
  return makePromise(n, n);
})
.print()
.map('Add return values by 1', (n, index, state) => {
  return n-1;
})
.print()
.filter('Filter out all return values less than 1000', (n, index, state) => {
  return n < 1000;
})
.print();
console.log('Task started');
