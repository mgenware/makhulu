import * as ma from '../lib/main';
import * as assert from 'assert';
import * as path from 'path';

function arrayToMap(array: string[]): { [key: number]: boolean } {
  const map: { [key: string]: boolean } = {};
  for (let n of array) {
    map[n] = true;
  }
  return map;
}

function testGlob(title: string, glob: string, files: string[]) {
  it(title, (done) => {
    const expFiles = files.map(f => path.join('dist/test/data', f));
    const task = ma.fs.glob('dist/test/data/' + glob);
    task.setReporter(null);
    task.then('', (values) => {
      assert.deepEqual(arrayToMap(values), arrayToMap(expFiles));
      done();
    });
  });
}

describe('Factory.FS.fileNames', () => {
  testGlob('All files', '**/*.*', ['test.json', 'dir/test.json', 'test.txt']);
  testGlob('Direct children', '*.*', ['test.json', 'test.txt']);
  testGlob('Custom filter', '**/*.json', ['test.json', 'dir/test.json']);
});
