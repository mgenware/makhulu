import IReporter from './reporter';
import DefaultReporter from './reporters/defaultReporter';
import EmptyReporter from './reporters/emptyReporter';
import { filterAsync } from 'node-filter-async';
const bluebird = require('bluebird') as any;
Promise = bluebird;

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
    this.checkDescriptionArgument(this.then.name, description);
    this.checkFunctionArgument(this.then.name, description, callback, 'callback');

    this.promise = this.promise.then((prevValues: any[]) => {
      const ret = callback(prevValues);
      this.checkReturnArray(this.then.name, description, ret);
      return ret;
    });
    return this;
  }

  mapSync(description: string, callback: (data: any, index: number) => any): Task {
    this.checkDescriptionArgument(this.mapSync.name, description);
    this.checkFunctionArgument(this.mapSync.name, description, callback, 'callback');

    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`➡️  mapSync: ${description}`);
      const promises = prevValues.map((value: any, index: number) => {
        const ret = callback(value, index);
        this.checkReturnUndefined(this.mapSync.name, description, ret);
        return ret;
      });
      const waitPromise = Promise.all(promises);
      this.reporter.printInfo(`${prevValues.length} item(s)`);
      return waitPromise;
    });
    return this;
  }

  mapSeries(description: string, callback: (data: any, index: number) => Promise<any>): Task {
    this.checkDescriptionArgument(this.mapSeries.name, description);
    this.checkFunctionArgument(this.mapSeries.name, description, callback, 'callback');

    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`➡️  mapSeries: ${description}`);
      const promises = bluebird.mapSeries(prevValues, (value: any, index: number) => {
        const ret = callback(value, index);
        return ret;
      });
      const waitPromise = Promise.all(promises);
      this.reporter.printInfo(`${prevValues.length} item(s)`);
      return waitPromise;
    });
    return this;
  }

  mapAsync(
    description: string,
    callback: (data: any, index: number) => Promise<any>,
    { concurrency }: { concurrency?: number } = {}): Task {
    this.checkDescriptionArgument(this.mapAsync.name, description);
    this.checkFunctionArgument(this.mapAsync.name, description, callback, 'callback');

    let opt: any;
    if (concurrency) {
      opt = {};
      opt.concurrency = concurrency;
    }

    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`➡️  mapAsync: ${description}`);
      const promises = bluebird.map(prevValues, (value: any, index: number) => {
        const ret = callback(value, index);
        return ret;
      }, opt);
      const waitPromise = Promise.all(promises);
      this.reporter.printInfo(`${prevValues.length} item(s)`);
      return waitPromise;
    });
    return this;
  }

  filterSync(description: string, callback: (data: any, index: number) => boolean): Task {
    this.checkDescriptionArgument(this.filterSync.name, description);
    this.checkFunctionArgument(this.filterSync.name, description, callback, 'callback');

    this.promise = this.promise.then((prevValues: any[]) => {
      this.reporter.printTitle(`✂️  filterSync: ${description}`);
      const newValues = prevValues.filter((element, index) => {
        const ret = callback(element, index);
        this.checkReturnNonbool(this.filterSync.name, description, ret);
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

  filterAsync(description: string, callback: (data: any, index: number) => Promise<boolean>): Task {
    this.checkDescriptionArgument(this.filterAsync.name, description);
    this.checkFunctionArgument(this.filterAsync.name, description, callback, 'callback');

    this.promise = this.promise.then(async (prevValues: any[]) => {
      this.reporter.printTitle(`✂️  filterAsync: ${description}`);

      const newValues = await filterAsync(prevValues, (value, index) => {
        const ret = callback(value, index);
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

  private throwError(funcName: string, desc: string, msg: string): string {
    if (!desc) {
      throw new Error(`[Func: "${funcName}"] ${msg}`);
    }
    throw new Error(`[Func: "${funcName}", Description: "${desc}"] ${msg}`);
  }

  private checkDescriptionArgument(funcName: string, desc: any) {
    if (typeof desc !== 'string') {
      this.throwError(funcName, desc, `The "description" argument must be a string`);
    }
  }

  private checkFunctionArgument(funcName: string, desc: string, arg: any, name: string) {
    if (typeof arg !== 'function') {
      this.throwError(funcName, desc, `The argument "${name}" must be a function`);
    }
  }

  private checkReturnUndefined(funcName: string, desc: string, ret: any) {
    if (ret === undefined) {
      this.throwError(funcName, desc, `Returning undefined is not allowed, you can return null instead. (did you forget to add a return statement?)`);
    }
  }

  private checkReturnNonbool(funcName: string, desc: string, ret: any) {
    if (typeof ret !== 'boolean') {
      this.throwError(funcName, desc, `Returning non-boolean values are not allowed for this method`);
    }
  }

  private checkReturnArray(funcName: string, desc: string, ret: any) {
    if (!(ret instanceof Array)) {
      this.throwError(funcName, desc, `"${funcName}" must return an array.`);
    }
  }
}
