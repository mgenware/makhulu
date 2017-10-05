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
    const expFiles = files.map(f => path.join('dist/test/data'));
    const task = ma.fs.fileNames('dist/test/data/' + glob);
    task.then((values) => {
      console.log(' 66666666 ', values);
      console.log(' =---====== ', arrayToMap(values), arrayToMap(expFiles));
      assert.deepEqual(arrayToMap(values), arrayToMap(expFiles));
      done();
    });
  });
}

describe('Factory.FS.fileNames', () => {
  testGlob('All files', '**/*.*', ['test.json', 'test.json', 'test.txt']);
  testGlob('Direct children', '*.*', ['test.json', 'test.txt']);
  testGlob('Custom filter', '**/*.json', ['test.json', 'test.json']);
});
