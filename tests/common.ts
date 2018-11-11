import * as mk from '../';
import { promisify } from 'util';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);

export function testDataList(src: mk.DataList, arr: object[]) {
  expect(src.list.map(d => d.toObject())).toEqual(arr);
}

export async function testFileAsync(path: string, content: string) {
  const res = await readFileAsync(path, 'utf8');
  expect(res).toBe(content);
}

// tslint:disable-next-line no-any
export function compareFileData(a: any, b: any): number {
  return (a[mk.fs.RelativeFile] as string).localeCompare(b[mk.fs.RelativeFile] as string);
}

export function testFileData(a: mk.DataList, b: object[]) {
  const src = a.list.map(d => d.toObject());
  src.sort(compareFileData);
  b.sort(compareFileData);
  expect(src).toEqual(b);
}
