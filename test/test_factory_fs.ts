import * as assert from 'assert';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as ma from '../lib/main';

function arrayToMap(array: string[]): { [key: number]: boolean } {
  const map: { [key: string]: boolean } = {};
  for (const n of array) {
    map[n] = true;
  }
  return map;
}

function testGlob(title: string, glob: string, files: string[]) {
  it(title, (done) => {
    const expFiles = files.map((f) => path.join('dist/test/data', f));
    const task = ma.fs.glob('dist/test/data/' + glob);
    task.setReporter(null);
    task.then('', (states) => {
      const values = states.map((s) => s.data);
      assert.deepEqual(arrayToMap(values), arrayToMap(expFiles));
      done();
    });
  });
}

function appendFile(s: string): string {
  return path.join(__dirname, s);
}

describe('Factory.FS.fileNames', () => {
  testGlob('All files', '**/*.*', ['test.json', 'dir/test.json', 'test.txt']);
  testGlob('Direct children', '*.*', ['test.json', 'test.txt']);
  testGlob('Custom filter', '**/*.json', ['test.json', 'dir/test.json']);
});

describe('Factory.FS.readFileAsync', () => {
  it('Read a file', (done) => {
    ma.fs.readFileAsync(appendFile('data/test.txt'), 'utf8').then((value: Buffer) => {
      assert.equal(value.toString(), 'sample text\n');
      done();
    });
  });
});

describe('Factory.FS.writeFileAsync', () => {
  it('Write a file', (done) => {
    const filePath = path.join(os.tmpdir(), 'makhulu/dir1/dir2/test.txt');
    const content = 'hello makhulu';
    ma.fs.writeFileAsync(filePath, content).then(() => {
      assert.equal(fs.readFileSync(filePath, 'utf8'), content);
      done();
    });
  });
});
