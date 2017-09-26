const ma = require('../dist/main');

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

ma.js.array([2000, 200, 2]).map((n, index, state) => {
  console.log('------', n, index, state);
  return makePromise(n, n);
}).map((n, index, state) => {
  console.log('------', n, index, state);
  return n-1;
}).map((n, index, state) => {
  console.log('------', n, index, state);
  return n-1;
});;
console.log('run');
