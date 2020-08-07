import DataList from './dataList';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function count(length: number, start = 0): DataList {
  if (length < 0) {
    throw new Error('The "length" argument cannot be negative');
  }
  const arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = start + i;
  }
  return DataList.all(arr, 'index');
}
