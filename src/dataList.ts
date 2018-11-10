import { default as DataItem, TypeInfo } from './dataItem';
import { throwIfFalsy } from 'throw-if-arg-empty';
import { filterAsync } from 'node-filter-async';

export default class DataList<T> {
  list: Array<DataItem<T>>;

  constructor(
    data: T[],
    typeInfoFn?: (entry: T) => TypeInfo,
  ) {
    throwIfFalsy(data, 'data');
    const entries = data.map(d => {
      const entry = new DataItem(d);
      if (typeInfoFn) {
        entry.typeInfo = typeInfoFn(d);
      }
      return entry;
    });
    this.list = entries;
  }

  values(): T[] {
    return this.list.map(d => d.value);
  }

  typeInfos(): TypeInfo[] {
    return this.list.map(d => d.typeInfo);
  }

  async updateListAsync<K>(fn: (entry: DataItem<T>) => Promise<DataItem<K>>): Promise<DataList<K>> {
    const promises = this.list.map(fn);
    const results = await Promise.all(promises);
    return this.setDataList(results);
  }

  async resetListAsync<K>(fn: (list: Array<DataItem<T>>) => Promise<Array<DataItem<K>>>): Promise<DataList<K>> {
    return this.setDataList(await fn(this.list));
  }

  async filterListAsync(fn: (item: DataItem<T>) => Promise<boolean>): Promise<DataList<T>> {
    this.list = await filterAsync(this.list, fn);
    return this;
  }

  async mapAsync<K>(fn: (value: T) => Promise<K>): Promise<DataList<K>> {
    return await this.updateListAsync(async e => {
      const value = await fn(e.value);
      return e.setValue(value);
    });
  }

  async filterAsync(fn: (value: T) => Promise<boolean>): Promise<DataList<T>> {
    return await this.filterListAsync(async e => fn(e.value));
  }

  private setDataList<K>(dataList: Array<DataItem<K>>): DataList<K> {
    this.list = (dataList as unknown) as Array<DataItem<T>>;
    return (this as unknown) as DataList<K>;
  }
}
