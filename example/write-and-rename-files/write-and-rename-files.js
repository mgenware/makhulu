const mkl = require('../..');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const Remarkable = require('remarkable');
const md = new Remarkable();
const rename = require('node-rename-path');
const path = require('path');

const DEST = './dist';

mkl.fs.glob('./src/**/*.md')
.map('Read files', (file) => {
  return fs.readFileAsync(file);
}).map('Markdown to HTML', (content) => {
  return md.render(content.toString());
}).filter('Save to disk', (html, state) => {
  const srcFile = mkl.fs.getRelativePathFromContext(state.context);
  const destFile = path.join(DEST, rename(srcFile, (pathObj) => {
    pathObj.ext = '.md';
  }));

  return fs.writeFileAsync(destFile, html);
});
console.log('Task started');
