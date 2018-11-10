import { Task } from '../';

function task(): Task<number> {
  return new Task([1, 2], d => new Map<string, unknown>([['raw', d]]));
}

function set(obj: object) {
  return new Map(Object.entries(obj));
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('Creation', () => {
  const t = task();
  expect(t.values()).toEqual([1, 2]);
  expect(t.typeInfos()).toEqual([
    set({raw: 1}),
    set({raw: 2}),
  ]);
});

test('updateEntriesAsync', async () => {
  const t = task();
  await t.updateEntriesAsync(async e => {
    if (e.value % 2 === 0) {
      await sleep(300);
    }
    e.typeInfo.set('raw', -1);
    return e.setValue(`s ${e.value}`);
  });
  expect(t.values()).toEqual(['s 1', 's 2']);
  expect(t.typeInfos()).toEqual([
    set({raw: -1}),
    set({raw: -1}),
  ]);
});

test('mapAsync', async () => {
  const t = task();
  await t.mapAsync(async v => `s ${v}`);
  expect(t.values()).toEqual(['s 1', 's 2']);
});

test('filterEntriesAsync', async () => {
  const t = task();
  await t.filterEntriesAsync(async e => {
    if (e.value % 2 === 0) {
      await sleep(300);
    }
    return e.value % 2 === 0;
  });
  expect(t.values()).toEqual([2]);
  expect(t.typeInfos()).toEqual([
    set({raw: 2}),
  ]);
});

test('filterAsync', async () => {
  const t = task();
  await t.filterAsync(async v => v % 2 === 0);
  expect(t.values()).toEqual([2]);
});
