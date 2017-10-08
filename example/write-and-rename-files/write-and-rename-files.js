const mkl = require('../..');
const Remarkable = require('remarkable');
const md = new Remarkable();
const rename = require('node-rename-path');
const path = require('path');

const DEST = './dist';

mkl.fs.glob('./src/**/*.md')
  .print()
  .map('Read files', (file) => {
    return mkl.fs.readFileAsync(file);
  })
  .filter('All documents containing "confidential" will not be processed', (content) => {
    return content.includes('confidential') === false;
  })
  .map('Markdown to HTML', (content) => {
    return md.render(content.toString());
  })
  .map('Save to disk', (html, state) => {
    const srcFile = mkl.fs.getRelativePathFromContext(state.context);
    const destFile = path.join(DEST, rename(srcFile, (pathObj) => {
      pathObj.ext = '.md';
    }));

    return mkl.fs.writeFileAsync(destFile, html);
  });

console.log('Task started');
