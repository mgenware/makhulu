export type TypeInfo = Map<string, unknown>;

export default class DataEntry<T> {
  typeInfo: TypeInfo;

  constructor(
    public value: T,
  ) {
    this.typeInfo = new Map<string, unknown>();
  }

  setValue<K>(value: K): DataEntry<K> {
    this.value = (value as unknown) as T;
    return (this as unknown) as DataEntry<K>;
  }
}
