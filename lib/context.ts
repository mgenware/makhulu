export default class Context {
  map: { [key: string] : any; } = {};
  
  getValue(key: string): any {
    return this.map[key];
  }

  setValue(key: string, value: any) {
    this.map[key] = value;
  }
}
