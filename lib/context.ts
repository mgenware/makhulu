export default class Context {
  private map: { [key: string]: any; } = {};

  getValue(key: string): any {
    return this.map[key];
  }

  setValue(key: string, value: any) {
    this.map[key] = value;
  }

  toString(): string {
    return JSON.stringify(this.map);
  }
}
