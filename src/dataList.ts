import { filterAsync } from 'node-filter-async';
import { throwIfFalsy } from 'throw-if-arg-empty';

export interface IData {
  [key: string]: unknown;
}

export type MapFn = (entry: IData) => Promise<IData>;
export type FilterFn = (entry: IData) => Promise<boolean>;
export type ResetFn = (list: IData[]) => Promise<IData[]>;

export default class DataList {
  static all(values: Array<unknown>, type: string): DataList {
    if (!values) {
      return new DataList();
    }
    return new DataList(values.map(v => ({ [type]: v})));
  }

  list: IData[];
  // defaults to -1 (not set)
  prevLength = -1;
  logging = true;

  constructor(
    list?: IData[],
  ) {
    this.list = list || [];
    this.logRoutines('Creation');
  }

  values(key: string): unknown {
    return this.list.map(d => d[key]);
  }

  disableLogging(): DataList {
    this.logging = false;
    return this;
  }

  async map(description: string, fn: MapFn): Promise<DataList> {
    this.logRoutines(description);

    const promises = this.list.map(fn);
    this.list = await Promise.all(promises);
    return this;
  }

  async reset(description: string, fn: ResetFn): Promise<DataList> {
    this.logRoutines(description);

    this.list = await fn(this.list);
    return this;
  }

  async filter(description: string, fn: FilterFn): Promise<DataList> {
    this.logRoutines(description);

    this.list = await filterAsync(this.list, fn);
    return this;
  }

  private logRoutines(description: string) {
    throwIfFalsy(description, 'description');
    this.logTitle(description);
    this.logLengthIfNeeded();
  }

  private logTitle(title: string) {
    this.log(`🚙 ${title}`);
  }

  private logLengthIfNeeded() {
    if (this.prevLength !== this.list.length) {
      const msg = this.prevLength >= 0 ? `${this.prevLength} -> ${this.list.length}` : `${this.list.length}`;
      this.log(`  LEN: ${msg}`);
      this.prevLength = this.list.length;
    }
  }

  private log(msg: string) {
    if (!this.logging) {
      return;
    }
    // tslint:disable-next-line no-console
    console.log(msg);
  }
}
