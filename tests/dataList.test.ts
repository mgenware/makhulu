import { DataList } from '../';

function task(): DataList {
  return new DataList([1, 2].map(d => ({ num: d})));
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('ctor', () => {
  const t = task();
  expect(t.list).toEqual([
    { num: 1 },
    { num: 2 },
  ]);
});

test('all', () => {
  const t = DataList.all([1, 2], 'haha');
  expect(t.list).toEqual([
    { haha: 1 },
    { haha: 2 },
  ]);
});

test('values', () => {
  const t = task();
  expect(t.values('num')).toEqual([1, 2]);
});

test('mapAsync', async () => {
  const t = task();
  await t.mapAsync(async d => {
    if ((d.num as number) % 2 === 0) {
      await sleep(300);
    }
    (d.num as number) += 1;
    d.changed = true;
    return d;
  });
  expect(t.list).toEqual([
    { num: 2, changed: true },
    { num: 3, changed: true },
  ]);
});

test('mapAsync with error', async () => {
  const t = task();
  try {
    await t.mapAsync(async () => {
      await sleep(300);
      throw new Error('Fake');
    });
    fail('Should catch an error');
  } catch (ex) {
    expect(ex.message).toBe('Fake');
  }
});

test('filterAsync', async () => {
  const t = task();
  await t.filterAsync(async d => {
    if ((d.num as number) % 2 === 0) {
      await sleep(300);
    }
    return (d.num as number) % 2 === 0;
  });
  expect(t.list).toEqual([{ num: 2 }]);
});

test('resetAsync', async () => {
  const t = task();
  const prevEntries = t.list;
  await sleep(300);
  await t.resetAsync(async entries => {
    const copied = [...entries];
    copied.reverse();
    return copied;
  });
  prevEntries.reverse();
  expect(t.list).toEqual(prevEntries);
});
