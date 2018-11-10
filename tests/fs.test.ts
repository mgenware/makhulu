import * as mk from '../';
import { promisify } from 'util';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);

const FilesDir = './tests/glob-files';

async function testFileAsync(path: string, content: string) {
  const res = await readFileAsync(path, 'utf8');
  expect(res).toBe(content);
}

function compareFileData(a: mk.IData, b: mk.IData): number {
  return (a[mk.fs.RelativePath] as string).localeCompare(b[mk.fs.RelativePath] as string);
}

function testFileData(a: object[], b: object[]) {
  const aCopy = [...a];
  const bCopy = [...b];
  aCopy.sort(compareFileData);
  bCopy.sort(compareFileData);
  expect(aCopy).toEqual(bCopy);
}

test('src - ** - direct children', async () => {
  const fileData = await mk.fs.src(FilesDir, '*.txt');
  testFileData(fileData.list, [
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

test('src - ** - all children', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  testFileData(fileData.list, [
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

test('src - no glob', async () => {
  const fileData = await mk.fs.src(FilesDir);
  testFileData(fileData.list, [
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
    {
      [mk.fs.RelativePath]: 'b.json',
      [mk.fs.SrcPath]: 'tests/glob-files/b.json',
    },
  ]);
});

test('fileToContentString', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  await fileData.map(mk.fs.fileToContentString);
  testFileData(fileData.list, [
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
  await testFileAsync('./dist_tests/files/a.txt', 'A\n');
});
