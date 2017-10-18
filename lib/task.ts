import IReporter from './reporter';
import DefaultReporter from './reporters/defaultReporter';
import EmptyReporter from './reporters/emptyReporter';
const Promise = require('bluebird') as any;

export default class Task {
  static fromPromise(promise: Promise<any[]>) {
    return new Task(promise);
  }

  static fromArray(array: any[]) {
    return this.fromPromise(Promise.resolve(array));
  }

  /* instance members */
  private reporter: IReporter;

  private constructor(public promise: any) {
    this.reporter = new DefaultReporter();
  }

  setReporter(rep: IReporter|null) {
    if (rep) {
      this.reporter = rep;
    } else {
      this.reporter = new EmptyReporter();
    }
  }

  then(description: string, callback: (array: any[]) => any[]): Task {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: any[]) => {
      const ret = callback(prevValues);
      this.checkReturnArray(ret, 'then');
      return ret;
    });
    return this;
  }

  mapSync(description: string, callback: (data: any, index: number) => any): Task {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`➡️  map: ${description}`);
      const promises = prevValues.map((value: any, index: number) => {
        const ret = callback(value, index);
        if (ret === undefined) {
          this.throwReturnUndefined('map');
        }
        return ret;
      });
      const waitPromise = Promise.all(promises);
      this.reporter.printInfo(`${prevValues.length} item(s)`);
      return waitPromise;
    });
    return this;
  }

  filterSync(description: string, callback: (data: any, index: number) => boolean): Task {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`✂️  filter: ${description}`);
      const newValues = prevValues.filter((element, index) => {
        const ret = callback(element, index);
        if (ret === undefined) {
          this.throwReturnUndefined('filter');
        }
        if (typeof ret !== 'boolean') {
          throw new Error(`"filter" must return a value of type boolean`);
        }
        return ret;
      });
      if (newValues.length === prevValues.length) {
        this.reporter.printInfo(`${prevValues.length} state(s)`);
      } else {
        this.reporter.printInfo(`${prevValues.length} -> ${newValues.length} state(s)`);
      }
      return newValues;
    });
    return this;
  }

  print(): Task {
    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`😀  print`);
      this.reporter.printInfo(`${prevValues.length} state(s)`);
      prevValues.forEach((value, index) => {
        /* tslint:disable-next-line:no-console */
        console.log(`[${index}] Value: ${value.data} Context: ${value.context.toString()}`);
      });
      return prevValues;
    });
    return this;
  }

  private checkStringArgument(name: string, arg: any) {
    if (typeof arg !== 'string') {
      throw new Error(`The argument "${name}" must be a string`);
    }
  }

  private checkFunctionArgument(name: string, arg: any) {
    if (typeof arg !== 'function') {
      throw new Error(`The argument "${name}" must be a function`);
    }
  }

  private throwReturnUndefined(funcName: string) {
    throw new Error(`"${funcName}" cannot return undefined, you can return null. (did you forget to add a return statement?)`);
  }

  private checkReturnArray(ret: any, funcName: string) {
    if (!(ret instanceof Array)) {
      throw new Error(`"${funcName}" must return an array.`);
    }
  }
}
