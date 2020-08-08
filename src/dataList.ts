/* eslint-disable class-methods-use-this */
import filterAsync from 'node-filter-async';
import { throwIfFalsy } from 'throw-if-arg-empty';
import * as colors from 'ansi-colors';
import * as ProgressBar from 'progress';
import { performance } from 'perf_hooks';
import * as prettyMS from 'pretty-ms';
import log from './log';

export interface DataObject {
  [key: string]: unknown;
}

export type MapFn = (obj: DataObject) => Promise<DataObject>;
export type ForEachFn = (obj: DataObject) => Promise<void>;
export type FilterFn = (obj: DataObject) => Promise<boolean>;
export type ResetFn = (objs: DataObject[]) => Promise<DataObject[]>;

export default class DataList {
  static logging = true;

  static all(values: unknown[], key: string): DataList {
    if (!values) {
      return new DataList();
    }
    return new DataList(values.map((value) => ({ [key]: value })));
  }

  list: DataObject[];

  // Enables debug output.
  verbose = false;

  // defaults to -1 (not set).
  private prevLength = -1;

  private startTime = 0;

  constructor(list?: DataObject[]) {
    this.list = list || [];
    const name = 'Job started';
    this.onActionStarted(name);
    this.onActionEnded(name);
  }

  get count(): number {
    return this.list.length;
  }

  values(key: string): unknown {
    throwIfFalsy(key, 'key');
    return this.list.map((d) => d[key]);
  }

  async map(name: string, fn: MapFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.onActionStarted(name);

    const promises = this.progressive(this.list.map(fn));
    this.list = await Promise.all(promises);

    this.onActionEnded(name);
  }

  async reset(name: string, fn: ResetFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.onActionStarted(name);

    this.list = await fn(this.list);

    this.onActionEnded(name);
  }

  async filter(name: string, fn: FilterFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.onActionStarted(name);

    const progBar = this.progressBar();
    this.list = await filterAsync(this.list, fn, () => progBar.tick());

    this.onActionEnded(name);
  }

  async forEach(name: string, fn: ForEachFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.onActionStarted(name);

    const promises = this.progressive(this.list.map(fn));
    await Promise.all(promises);

    this.onActionEnded(name);
  }

  logList() {
    log(this.list);
  }

  private onActionStarted(name: string) {
    this.logName(name);
    this.startTime = performance.now();
  }

  private onActionEnded(_: string) {
    this.logLength();
    if (this.verbose) {
      this.logList();
    }
    const duration = performance.now() - this.startTime;
    this.logTime(prettyMS(duration));
  }

  private logName(name: string) {
    throwIfFalsy(name, 'name');
    log(colors.cyan(`🦁 ${name}`));
  }

  private logTime(s: string) {
    log(colors.gray(`> Done in ${s}`));
  }

  private logLength() {
    if (this.prevLength !== this.list.length) {
      let msg =
        this.prevLength >= 0
          ? `${this.prevLength} --> ${this.list.length}`
          : `${this.list.length}`;
      msg += ' item(s)';
      log(colors.yellow(`> ${msg}`));
      this.prevLength = this.list.length;
    }
  }

  private progressBar(): ProgressBar {
    return new ProgressBar('[:bar]', {
      complete: '=',
      incomplete: ' ',
      width: process.stdout.columns ? process.stdout.columns - 2 : 20,
      total: this.count,
      clear: true,
    });
  }

  private progressive<T>(promises: Array<Promise<T>>): Array<Promise<T>> {
    const bar = this.progressBar();
    return promises.map(async (p) => {
      const result = await p;
      bar.tick();
      return result;
    });
  }
}
