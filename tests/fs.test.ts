import { fs } from '../';

const GlobFiles = './tests/glob-files/';

test('glob', async () => {
  const fileData = await fs.glob(`${GlobFiles}*.txt`);
  expect(fileData.list).toEqual([
    { [fs.RelativeFilePath]: './tests/glob-files/a.txt' },
    { [fs.RelativeFilePath]: './tests/glob-files/c.txt' },
  ]);
});

test('fileToContentString', async () => {
  const fileData = await fs.glob(`${GlobFiles}**/*.txt`);
  await fileData.map(fs.fileToContentString);
  expect(fileData.list).toEqual([
    { [fs.RelativeFilePath]: './tests/glob-files/a.txt', [fs.FileContent]: 'A\n' },
    { [fs.RelativeFilePath]: './tests/glob-files/c.txt', [fs.FileContent]: 'C\n' },
    { [fs.RelativeFilePath]: './tests/glob-files/sub/d.txt', [fs.FileContent]: 'D\n' },
  ]);
});
