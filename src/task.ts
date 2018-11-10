import { default as DataEntry, TypeInfo } from './dataEntry';
import { throwIfFalsy } from 'throw-if-arg-empty';

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

  async updateEntryAsync<K>(fn: (entry: DataEntry<T>) => Promise<DataEntry<K>>): Promise<Task<K>> {
    const promises = this.dataList.map(fn);
    const results = await Promise.all(promises);
    this.dataList = (results as unknown) as Array<DataEntry<T>>;
    return (this as unknown) as Task<K>;
  }

  async mapAsync<K>(fn: (value: T) => Promise<K>): Promise<Task<K>> {
    return await this.updateEntryAsync(async e => {
      const value = await fn(e.value);
      return e.setValue(value);
    });
  }
}
