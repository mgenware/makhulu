const mkl = require('../..');
const globby = require('globby');
const mfs = require('m-fs');

const task = new mkl.Task()
  .mapAsync('Read files', (file) => {
    return mfs.readFileAsync(file);
  })
  .mapSync('Parse JSON', (content) => {
    return JSON.parse(content);
  })
  .filterSync('Filter objects', (person) => {
    return person.gender === 'male' && person.age >= 18;
  })
  .mapSync('Map names', person => person.name)
  .then('Print names', (names) => {
    console.log(`Males over 18: ${names}`);
    return names;
  });

task.runWithPromise(globby('data/**/*.json'));
