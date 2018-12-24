import { DataList, setLoggingEnabled } from '../';
import { testDataList } from './common';

setLoggingEnabled(false);

function task(): DataList {
  return new DataList([1, 2].map(d => ({ num: d })));
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('ctor', () => {
  const t = task();
  testDataList(t, [{ num: 1 }, { num: 2 }]);
});

test('all', () => {
  const t = DataList.all([1, 2], 'haha');
  testDataList(t, [{ haha: 1 }, { haha: 2 }]);
});

test('values', () => {
  const t = task();
  expect(t.values('num')).toEqual([1, 2]);
});

test('map', async () => {
  const t = task();
  await t.map('t', async d => {
    if ((d.num as number) % 2 === 0) {
      await sleep(300);
    }
    (d.num as number) += 1;
    d.changed = true;
    return d;
  });
  testDataList(t, [{ num: 2, changed: true }, { num: 3, changed: true }]);
});

test('map with error', async () => {
  const t = task();
  try {
    await t.map('t', async () => {
      await sleep(300);
      throw new Error('Fake');
    });
    fail('Should catch an error');
  } catch (ex) {
    expect(ex.message).toBe('Fake');
  }
});

test('filter', async () => {
  const t = task();
  await t.filter('t', async d => {
    if ((d.num as number) % 2 === 0) {
      await sleep(300);
    }
    return (d.num as number) % 2 === 0;
  });
  testDataList(t, [{ num: 2 }]);
});

test('reset', async () => {
  const t = task();
  const prevEntries = t.list;
  await sleep(300);
  await t.reset('t', async entries => {
    const copied = [...entries];
    copied.reverse();
    return copied;
  });
  prevEntries.reverse();
  expect(t.list).toEqual(prevEntries);
});
