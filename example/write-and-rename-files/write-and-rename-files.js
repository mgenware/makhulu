const mkl = require('../..');
const md = require('markdown-it')('commonmark');
const globby = require('globby');
const rename = require('node-rename-path');
const path = require('path');
const mfs = require('m-fs');

const DEST = './dist';

const task = new mkl.Task()
  .print()
  .mapAsync('Read files', (file) => {
    return {
      file,
      content: mfs.readFileAsync(file),
    };
  })
  .filterSync('All documents containing "confidential" will not be processed', (item) => {
    return {
      file: item.file,
      content: item.content.includes('confidential') === false,
    };
  })
  .mapSync('Markdown to HTML', (item) => {
    return {
      file: item.file, 
      content: md.render(item.content.toString()),
    };
  })
  .mapAsync('Save to disk', (item) => {
    const destFile = path.join(DEST, rename(item.file, (pathObj) => {
      pathObj.ext = '.md';
    }));

    return mfs.writeFileAsync(destFile, item.content);
  });

task.runWithPromise(globby('data/**/*.md'));
console.log('Task started');
