import * as mk from '../';
import { promisify } from 'util';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);

const FilesDir = './tests/glob-files';

async function testFile(path: string, content: string) {
  const res = await readFileAsync(path, 'utf8');
  expect(res).toBe(content);
}

test('glob - ** - direct children', async () => {
  const fileData = await mk.fs.src(FilesDir, '*.txt');
  expect(fileData.list).toEqual([
    {
      [mk.fs.RelativePath]: 'a.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/a.txt',
    },
    {
      [mk.fs.RelativePath]: 'c.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/c.txt',
    },
  ]);
});

test('glob - ** - all children', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  expect(fileData.list).toEqual([
    {
      [mk.fs.RelativePath]: 'a.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/a.txt',
    },
    {
      [mk.fs.RelativePath]: 'c.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/c.txt',
    },
    {
      [mk.fs.RelativePath]: 'sub/d.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/sub/d.txt',
    },
  ]);
});

test('fileToContentString', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  await fileData.map(mk.fs.fileToContentString);
  expect(fileData.list).toEqual([
    {
      [mk.fs.RelativePath]: 'a.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/a.txt',
      [mk.fs.FileContent]: 'A\n',
    },
    {
      [mk.fs.RelativePath]: 'c.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/c.txt',
      [mk.fs.FileContent]: 'C\n',
    },
    {
      [mk.fs.RelativePath]: 'sub/d.txt',
      [mk.fs.SrcPath]: 'tests/glob-files/sub/d.txt',
      [mk.fs.FileContent]: 'D\n',
    },
  ]);
});

test('saveToDirectory', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  await fileData.map(mk.fs.fileToContentString);
  await fileData.map(mk.fs.saveToDirectory('./dist_tests/files/'));
  await testFile('./dist_tests/files/a.txt', 'A\n');
});
