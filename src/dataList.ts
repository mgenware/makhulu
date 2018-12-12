import { filterAsync } from 'node-filter-async';
import { throwIfFalsy } from 'throw-if-arg-empty';
import * as colors from 'ansi-colors';
import log from './log';

export class DataObject {
  static fromEntries(params: Array<[string, unknown]>): DataObject {
    const map = new Map<string, unknown>();
    if (params) {
      for (const arr of params) {
        if (!Array.isArray(arr)) {
          throw new Error(`Argument not an array: ${arr}`);
        }
        if (arr.length !== 2) {
          throw new Error(`Array length should always be 2: ${arr}`);
        }
        const [k, v] = arr;
        map.set(k as string, v);
      }
    }
    return new DataObject(map);
  }

  map: Map<string, unknown>;

  constructor(map: Map<string, unknown>) {
    this.map = map || new Map<string, unknown>();
  }

  get(key: string): unknown {
    return this.map.get(key);
  }

  set(key: string, value: unknown): DataObject {
    this.map.set(key, value);
    return this;
  }

  copy(): DataObject {
    return new DataObject(this.map);
  }

  toObject(): object {
    // tslint:disable-next-line no-any
    const obj: any = {};
    for (const [key, value] of this.map) {
      obj[key] = value;
    }
    return obj;
  }
}

export type MapFn = (obj: DataObject) => Promise<DataObject>;
export type ForEachFn = (obj: DataObject) => Promise<void>;
export type FilterFn = (obj: DataObject) => Promise<boolean>;
export type ResetFn = (objs: DataObject[]) => Promise<DataObject[]>;

export default class DataList {
  static logging = true;

  static all(values: Array<unknown>, key: string): DataList {
    if (!values) {
      return new DataList();
    }
    return new DataList(
      values.map(value => DataObject.fromEntries([[key, value]])),
    );
  }

  list: DataObject[];
  // defaults to -1 (not set)
  prevLength = -1;

  constructor(list?: DataObject[]) {
    this.list = list || [];
    this.logRoutines('Creation');
  }

  values(key: string): unknown {
    throwIfFalsy(key, 'key');
    return this.list.map(d => d.get(key));
  }

  async map(description: string, fn: MapFn): Promise<DataList> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    const promises = this.list.map(fn);
    this.list = await Promise.all(promises);
    return this;
  }

  async reset(description: string, fn: ResetFn): Promise<DataList> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    this.list = await fn(this.list);
    return this;
  }

  async filter(description: string, fn: FilterFn): Promise<DataList> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    this.list = await filterAsync(this.list, fn);
    return this;
  }

  async forEach(description: string, fn: ForEachFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    const promises = this.list.map(fn);
    await Promise.all(promises);
  }

  private logRoutines(description: string) {
    throwIfFalsy(description, 'description');
    this.logTitle(description);
    this.logLengthIfNeeded();
  }

  private logTitle(title: string) {
    log(colors.cyan(`🚙 ${title}`));
  }

  private logLengthIfNeeded() {
    if (this.prevLength !== this.list.length) {
      const msg =
        this.prevLength >= 0
          ? `${this.prevLength} -> ${this.list.length}`
          : `${this.list.length}`;
      log(colors.yellow(`  >> ${msg}`));
      this.prevLength = this.list.length;
    }
  }
}
