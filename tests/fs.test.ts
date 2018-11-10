import { fileSystem } from '../';

const GlobFiles = './tests/glob-files/';

function map(obj: object) {
  return new Map(Object.entries(obj));
}

test('FileData', () => {
  const fileData = fileSystem.fileList(['a', 'b']);
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

test('All files, fileToContentString, typeInfo', async () => {
  const fileData = await fileSystem.globAsync(`${GlobFiles}**/*.txt`);
  await fileData.mapAsync(fileSystem.fileToContentStringAsync);
  expect(fileData.values()).toEqual(['A\n', 'C\n', 'D\n']);

  // verify type infos not changing
  const list = fileData.list;
  expect(list.length).toBe(3);
  list.sort((a, b) => (a.typeInfo.get('FILE') as string).localeCompare((b.typeInfo.get('FILE') as string)));
  expect(list[0].typeInfo).toEqual(map({FILE: './tests/glob-files/a.txt'}));
  expect(list[1].typeInfo).toEqual(map({FILE: './tests/glob-files/c.txt'}));
  expect(list[2].typeInfo).toEqual(map({FILE: './tests/glob-files/sub/d.txt'}));
});
