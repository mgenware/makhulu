const ma = require('../..');
const Promise = require('bluebird');
const readFileAsync = Promise.promisify(require("fs").readFile);

ma.fs.glob('./data/**/*.json')
.map('Read files', (file) => {
  return readFileAsync(file);
}).map('Parse JSON', (content) => {
  return JSON.parse(content);
}).filter('Filter objects', (obj) => {
  return obj.gender == 'male' && obj.age >= 18;
}).map('Map names', (obj) => obj.name).then('Print names', (names) => {
  console.log(`Males over 18: ${names}`);
});
console.log('Task started');
