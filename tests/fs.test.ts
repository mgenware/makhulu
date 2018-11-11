import * as mk from '../';
import { testFileData, testFileAsync } from './common';
const FilesDir = './tests/glob-files';

mk.setLoggingEnabled(false);

test('src - ** - direct children', async () => {
  const fileData = await mk.fs.src(FilesDir, '*.txt');
  testFileData(fileData, [
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
  testFileData(fileData, [
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
  testFileData(fileData, [
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

test('src - multiple patterns', async () => {
  const fileData = await mk.fs.src(FilesDir, ['**/*', '!*.json']);
  testFileData(fileData, [
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
  await fileData.map('Read files', mk.fs.fileToContentString);
  testFileData(fileData, [
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
  await fileData.map('Read files', mk.fs.fileToContentString);
  await fileData.map('Write files', mk.fs.saveToDirectory('./dist_tests/files/'));
  await testFileAsync('./dist_tests/files/a.txt', 'A\n');
});
