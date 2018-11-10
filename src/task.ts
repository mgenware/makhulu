import { default as DataEntry, TypeInfo } from './dataEntry';
import { throwIfFalsy } from 'throw-if-arg-empty';
import { filterAsync } from 'node-filter-async';

export default class Task<T> {
  dataList: Array<DataEntry<T>>;

  constructor(
    data: T[],
    typeInfoFn?: (entry: T) => TypeInfo,
  ) {
    throwIfFalsy(data, 'data');
    const entries = data.map(d => {
      const entry = new DataEntry(d);
      if (typeInfoFn) {
        entry.typeInfo = typeInfoFn(d);
      }
      return entry;
    });
    this.dataList = entries;
  }

  values(): T[] {
    return this.dataList.map(d => d.value);
  }

  typeInfos(): TypeInfo[] {
    return this.dataList.map(d => d.typeInfo);
  }

  async updateEntriesAsync<K>(fn: (entry: DataEntry<T>) => Promise<DataEntry<K>>): Promise<Task<K>> {
    const promises = this.dataList.map(fn);
    const results = await Promise.all(promises);
    return this.setDataList(results);
  }

  async resetEntriesAsync<K>(fn: (entries: Array<DataEntry<T>>) => Promise<Array<DataEntry<K>>>): Promise<Task<K>> {
    return this.setDataList(await fn(this.dataList));
  }

  async filterEntriesAsync(fn: (entry: DataEntry<T>) => Promise<boolean>): Promise<Task<T>> {
    this.dataList = await filterAsync(this.dataList, fn);
    return this;
  }

  async mapAsync<K>(fn: (value: T) => Promise<K>): Promise<Task<K>> {
    return await this.updateEntriesAsync(async e => {
      const value = await fn(e.value);
      return e.setValue(value);
    });
  }

  async filterAsync(fn: (value: T) => Promise<boolean>): Promise<Task<T>> {
    return await this.filterEntriesAsync(async e => fn(e.value));
  }

  private setDataList<K>(dataList: Array<DataEntry<K>>): Task<K> {
    this.dataList = (dataList as unknown) as Array<DataEntry<T>>;
    return (this as unknown) as Task<K>;
  }
}
