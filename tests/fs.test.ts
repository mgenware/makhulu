/* eslint-disable no-param-reassign */
import { itRejects } from 'it-throws';
import * as mk from '..';
import { testFileData, testFileAsync } from './common';

const FilesDir = './tests/glob-files';

mk.setLoggingEnabled(false);

it('src - ** - direct children', async () => {
  const files = await mk.fs.src(FilesDir, '*.txt');
  testFileData(files, [
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

it('src - ** - all children', async () => {
  const files = await mk.fs.src(FilesDir, '**/*.txt');
  testFileData(files, [
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

it('src - no glob', async () => {
  const files = await mk.fs.src(FilesDir);
  testFileData(files, [
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
    {
      [mk.fs.RelativeFile]: 'empty.bin',
      [mk.fs.SrcDir]: FilesDir,
    },
  ]);
});

it('src - multiple patterns', async () => {
  const files = await mk.fs.src(FilesDir, ['**/*', '!*.json', '!empty.bin']);
  testFileData(files, [
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

it('readToString', async () => {
  const files = await mk.fs.src(FilesDir, '**/*.txt');
  await files.map('Read files', mk.fs.readToString);
  testFileData(files, [
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

it('writeToDirectory', async () => {
  const dest = './dist_tests/files/copy';
  const files = await mk.fs.src(FilesDir, '**/*.txt');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Write files', mk.fs.writeToDirectory(dest));
  await testFileAsync(`${dest}/a.txt`, 'A\n');
  await testFileAsync(`${dest}/c.txt`, 'C\n');
  await testFileAsync(`${dest}/sub/d.txt`, 'D\n');
});

it('writeToDirectory (change content)', async () => {
  const dest = './dist_tests/files/mod';
  const files = await mk.fs.src(FilesDir, '**/*.txt');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Update files', async (d) => {
    const content = d[mk.fs.FileContent] as string;
    d[mk.fs.FileContent] = '*' + content;
    return d;
  });
  await files.map('Write files', mk.fs.writeToDirectory(dest));
  await testFileAsync(`${dest}/a.txt`, '*A\n');
  await testFileAsync(`${dest}/c.txt`, '*C\n');
  await testFileAsync(`${dest}/sub/d.txt`, '*D\n');
});

it('writeToDirectory (null content)', async () => {
  const dest = './dist_tests/files/_';
  const files = await mk.fs.src(FilesDir, 'empty.bin');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Update files', async (d) => {
    d[mk.fs.FileContent] = null;
    return d;
  });
  await itRejects(
    files.map('Write files', mk.fs.writeToDirectory(dest)),
    /writeToDirectory: File content not found on data object/,
  );
});

it('writeToDirectory (empty file)', async () => {
  const dest = './dist_tests/files/empty_file';
  const files = await mk.fs.src(FilesDir, 'empty.bin');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Write files', mk.fs.writeToDirectory(dest));
  await testFileAsync(`${dest}/empty.bin`, '');
});
