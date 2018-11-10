import { Task } from '../';

function task(): Task<number> {
  return new Task([1, 2], d => new Map<string, unknown>([['raw', d]]));
}

function set(obj: object) {
  return new Map(Object.entries(obj));
}

test('Creation', () => {
  const t = task();
  expect(t.values()).toEqual([1, 2]);
  expect(t.typeInfos()).toEqual([
    set({raw: 1}),
    set({raw: 2}),
  ]);
});

test('updateEntryAsync', () => {
  const t = task();
  t.updateEntryAsync(async e => {
    e.typeInfo.set('raw', -1);
    return e.setValue(`s ${e.value}`);
  });
  expect(t.values()).toEqual(['s 1', 's 2']);
  expect(t.typeInfos()).toEqual([
    set({raw: -1}),
    set({raw: -1}),
  ]);
});
