import * as mk from '../';
import { testFileData, testFileAsync } from './common';
const FilesDir = './tests/glob-files';

mk.setLoggingEnabled(false);

test('src - ** - direct children', async () => {
  const fileData = await mk.fs.src(FilesDir, '*.txt');
  testFileData(fileData, [
    {
      [mk.fs.RelativeFile]: 'a.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'c.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
  ]);
});

test('src - ** - all children', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  testFileData(fileData, [
    {
      [mk.fs.RelativeFile]: 'a.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'c.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'sub/d.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
  ]);
});

test('src - no glob', async () => {
  const fileData = await mk.fs.src(FilesDir);
  testFileData(fileData, [
    {
      [mk.fs.RelativeFile]: 'a.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'c.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'sub/d.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'b.json',
      [mk.fs.SrcDir]: FilesDir,
    },
  ]);
});

test('src - multiple patterns', async () => {
  const fileData = await mk.fs.src(FilesDir, ['**/*', '!*.json']);
  testFileData(fileData, [
    {
      [mk.fs.RelativeFile]: 'a.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'c.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
    {
      [mk.fs.RelativeFile]: 'sub/d.txt',
      [mk.fs.SrcDir]: FilesDir,
    },
  ]);
});

test('fileToContentString', async () => {
  const fileData = await mk.fs.src(FilesDir, '**/*.txt');
  await fileData.map('Read files', mk.fs.fileToContentString);
  testFileData(fileData, [
    {
      [mk.fs.RelativeFile]: 'a.txt',
      [mk.fs.SrcDir]: FilesDir,
      [mk.fs.FileContent]: 'A\n',
    },
    {
      [mk.fs.RelativeFile]: 'c.txt',
      [mk.fs.SrcDir]: FilesDir,
      [mk.fs.FileContent]: 'C\n',
    },
    {
      [mk.fs.RelativeFile]: 'sub/d.txt',
      [mk.fs.SrcDir]: FilesDir,
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
