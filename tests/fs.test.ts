import { fs } from '../';

const GlobFiles = './tests/glob-files/';

test('glob', async () => {
  const fileData = await fs.globAsync(`${GlobFiles}*.txt`);
  expect(fileData.list).toEqual([
    { [fs.RelativeFilePath]: './tests/glob-files/a.txt' },
    { [fs.RelativeFilePath]: './tests/glob-files/c.txt' },
  ]);
});

test('fileToContentString', async () => {
  const fileData = await fs.globAsync(`${GlobFiles}**/*.txt`);
  await fileData.mapAsync(fs.fileToContentStringAsync);
  expect(fileData.list).toEqual([
    { [fs.RelativeFilePath]: './tests/glob-files/a.txt', [fs.FileContent]: 'A\n' },
    { [fs.RelativeFilePath]: './tests/glob-files/c.txt', [fs.FileContent]: 'C\n' },
    { [fs.RelativeFilePath]: './tests/glob-files/sub/d.txt', [fs.FileContent]: 'D\n' },
  ]);
});
