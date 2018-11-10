import { fileSystem } from '../';

const GlobFiles = './tests/glob-files/';

function map(obj: object) {
  return new Map(Object.entries(obj));
}

test('FileData', () => {
  const fileData = fileSystem.fileDataList(['a', 'b']);
  expect(fileData.list.length).toBe(2);
  expect(fileData.list[0].value).toBe('a');
  expect(fileData.list[0].typeInfo).toEqual(map({FILE: 'a'}));
  expect(fileData.list[1].value).toBe('b');
  expect(fileData.list[1].typeInfo).toEqual(map({FILE: 'b'}));
});

test('glob', async () => {
  const fileData = await fileSystem.globAsync(`${GlobFiles}*.txt`);
  expect(fileData.values().sort()).toEqual(['a.txt', 'c.txt'].map(f => GlobFiles + f).sort());
});
