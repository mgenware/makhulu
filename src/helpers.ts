export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function count(length: number, start = 0): number[] {
  if (length < 0) {
    throw new Error('The "length" argument cannot be negative');
  }
  const arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = start + i;
  }
  return arr;
}
