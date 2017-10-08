const mkl = require('../..');

mkl.fs.glob('./data/**/*.json')
  .map('Read files', (file) => {
    return mkl.fs.readFileAsync(file);
  })
  .map('Parse JSON', (content) => {
    return JSON.parse(content);
  })
  .filter('Filter objects', (person) => {
    return person.gender === 'male' && person.age >= 18;
  })
  .map('Map names', person => person.name)
  .then('Print names', (states) => {
    const names = states.map(s => s.data);
    console.log(`Males over 18: ${names}`);
  });
console.log('Task started');
