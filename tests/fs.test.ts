import * as mk from '../';
import { testFileData, testFileAsync } from './common';
const FilesDir = './tests/glob-files';

mk.setLoggingEnabled(false);

test('src - ** - direct children', async () => {
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

test('src - ** - all children', async () => {
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

test('src - no glob', async () => {
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

test('src - multiple patterns', async () => {
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

test('readToString', async () => {
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

test('writeToDirectory', async () => {
  const dest = './dist_tests/files/copy';
  const files = await mk.fs.src(FilesDir, '**/*.txt');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Write files', mk.fs.writeToDirectory(dest));
  await testFileAsync(`${dest}/a.txt`, 'A\n');
  await testFileAsync(`${dest}/c.txt`, 'C\n');
  await testFileAsync(`${dest}/sub/d.txt`, 'D\n');
});

test('writeToDirectory (change content)', async () => {
  const dest = './dist_tests/files/mod';
  const files = await mk.fs.src(FilesDir, '**/*.txt');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Update files', async d => {
    const content = d[mk.fs.FileContent] as string;
    d[mk.fs.FileContent] = '*' + content;
    return d;
  });
  await files.map('Write files', mk.fs.writeToDirectory(dest));
  await testFileAsync(`${dest}/a.txt`, '*A\n');
  await testFileAsync(`${dest}/c.txt`, '*C\n');
  await testFileAsync(`${dest}/sub/d.txt`, '*D\n');
});

test('writeToDirectory (null content)', async () => {
  const dest = './dist_tests/files/_';
  const files = await mk.fs.src(FilesDir, 'empty.bin');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Update files', async d => {
    d[mk.fs.FileContent] = null;
    return d;
  });
  await expect(
    files.map('Write files', mk.fs.writeToDirectory(dest)),
  ).rejects.toThrow('writeToDirectory: File content not found on data object');
});

test('writeToDirectory (empty file)', async () => {
  const dest = './dist_tests/files/empty_file';
  const files = await mk.fs.src(FilesDir, 'empty.bin');
  await files.map('Read files', mk.fs.readToString);
  await files.map('Write files', mk.fs.writeToDirectory(dest));
  await testFileAsync(`${dest}/empty.bin`, '');
});
