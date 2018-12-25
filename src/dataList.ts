import filterAsync from 'node-filter-async';
import { throwIfFalsy } from 'throw-if-arg-empty';
import * as colors from 'ansi-colors';
import log from './log';
import * as ProgressBar from 'progress';

export interface DataObject {
  [key: string]: unknown;
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
    return new DataList(values.map(value => ({ [key]: value })));
  }

  list: DataObject[];
  // defaults to -1 (not set)
  prevLength = -1;
  autoLog = false;

  constructor(list?: DataObject[], autoLog = false) {
    this.autoLog = autoLog;
    this.list = list || [];
    this.logRoutines('Job started');
    this.logLengthIfNeeded();
    this.logIfNeeded();
  }

  get count(): number {
    return this.list.length;
  }

  values(key: string): unknown {
    throwIfFalsy(key, 'key');
    return this.list.map(d => d[key]);
  }

  async map(description: string, fn: MapFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    const promises = this.progressive(this.list.map(fn));
    this.list = await Promise.all(promises);
    this.logLengthIfNeeded();
    this.logIfNeeded();
  }

  async reset(description: string, fn: ResetFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    this.list = await fn(this.list);
    this.logLengthIfNeeded();
    this.logIfNeeded();
  }

  async filter(description: string, fn: FilterFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    const progBar = this.progressBar();
    this.list = await filterAsync(this.list, fn, () => progBar.tick());
    this.logLengthIfNeeded();
    this.logIfNeeded();
  }

  async forEach(description: string, fn: ForEachFn): Promise<void> {
    throwIfFalsy(fn, 'fn');
    this.logRoutines(description);

    const promises = this.progressive(this.list.map(fn));
    await Promise.all(promises);
    this.logIfNeeded();
  }

  log() {
    // tslint:disable-next-line no-console
    console.log(this.list);
  }

  startLogging() {
    this.autoLog = true;
  }

  stopLogging() {
    this.autoLog = false;
  }

  private logIfNeeded() {
    if (this.autoLog) {
      this.log();
    }
  }

  private logRoutines(description: string) {
    throwIfFalsy(description, 'description');
    this.logTitle(description);
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
    return promises.map(async p => {
      const result = await p;
      bar.tick();
      return result;
    });
  }
}
