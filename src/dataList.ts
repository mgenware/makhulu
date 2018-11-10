import { filterAsync } from 'node-filter-async';

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

  constructor(
    list?: IData[],
  ) {
    this.list = list || [];
  }

  values(key: string): unknown {
    return this.list.map(d => d[key]);
  }

  async map(fn: MapFn): Promise<DataList> {
    const promises = this.list.map(fn);
    this.list = await Promise.all(promises);
    return this;
  }

  async reset(fn: ResetFn): Promise<DataList> {
    this.list = await fn(this.list);
    return this;
  }

  async filter(fn: FilterFn): Promise<DataList> {
    this.list = await filterAsync(this.list, fn);
    return this;
  }
}
