import { promisify } from 'util';
import * as fs from 'fs';
import * as assert from 'assert';
import * as mk from '..';

const readFileAsync = promisify(fs.readFile);

export function testDataList(src: mk.DataList, arr: Record<string, unknown>[]) {
  assert.deepEqual(src.list, arr);
}

export async function testFileAsync(path: string, content: string) {
  const res = await readFileAsync(path, 'utf8');
  assert.equal(res, content);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareFileData(a: any, b: any): number {
  return (a[mk.fs.RelativeFile] as string).localeCompare(
    b[mk.fs.RelativeFile] as string,
  );
}

export function testFileData(a: mk.DataList, b: Record<string, unknown>[]) {
  const src = a.list;
  src.sort(compareFileData);
  b.sort(compareFileData);
  assert.deepEqual(src, b);
}
