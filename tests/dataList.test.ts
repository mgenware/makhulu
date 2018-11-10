import { DataList } from '../';

function task(): DataList<number> {
  return new DataList([1, 2], d => new Map<string, unknown>([['raw', d]]));
}

function map(obj: object) {
  return new Map(Object.entries(obj));
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('Creation', () => {
  const t = task();
  expect(t.values()).toEqual([1, 2]);
  expect(t.typeInfos()).toEqual([
    map({raw: 1}),
    map({raw: 2}),
  ]);
});

test('updateListAsync', async () => {
  const t = task();
  await t.updateListAsync(async e => {
    if (e.value % 2 === 0) {
      await sleep(300);
    }
    e.typeInfo.set('raw', -1);
    return e.setValue(`s ${e.value}`);
  });
  expect(t.values()).toEqual(['s 1', 's 2']);
  expect(t.typeInfos()).toEqual([
    map({raw: -1}),
    map({raw: -1}),
  ]);
});

test('mapAsync', async () => {
  const t = task();
  await t.mapAsync(async v => `s ${v}`);
  expect(t.values()).toEqual(['s 1', 's 2']);
});

test('filterListAsync', async () => {
  const t = task();
  await t.filterListAsync(async e => {
    if (e.value % 2 === 0) {
      await sleep(300);
    }
    return e.value % 2 === 0;
  });
  expect(t.values()).toEqual([2]);
  expect(t.typeInfos()).toEqual([
    map({raw: 2}),
  ]);
});

test('filterAsync', async () => {
  const t = task();
  await t.filterAsync(async v => v % 2 === 0);
  expect(t.values()).toEqual([2]);
});

test('resetListAsync', async () => {
  const t = task();
  const prevEntries = t.list;
  await sleep(300);
  await t.resetListAsync(async entries => {
    const copied = [...entries];
    copied.reverse();
    return copied;
  });
  prevEntries.reverse();
  expect(t.list).toEqual(prevEntries);
});
