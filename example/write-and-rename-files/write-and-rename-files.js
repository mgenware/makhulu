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
    return mfs.readFileAsync(file);
  })
  .filterSync('All documents containing "confidential" will not be processed', (content) => {
    return content.includes('confidential') === false;
  })
  .mapSync('Markdown to HTML', (content) => {
    return md.render(content.toString());
  })
  .mapAsync('Save to disk', (html, state) => {
    const srcFile = mkl.fs.getRelativePathFromContext(state.context);
    const destFile = path.join(DEST, rename(srcFile, (pathObj) => {
      pathObj.ext = '.md';
    }));

    return mfs.writeFileAsync(destFile, html);
  });

task.runWithPromise(globby('data/**/*.md'));
console.log('Task started');
