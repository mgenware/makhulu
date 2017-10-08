import State from './state';
import IReporter from './reporter';
import DefaultReporter from './reporters/defaultReporter';
import EmptyReporter from './reporters/emptyReporter';
const Promise = require('bluebird') as any;

export default class Task {
  static fromPromise(promise: any) {
    return new Task(promise);
  }

  static fromInitialStates(initialStates: State[]) {
    return new Task(Promise.resolve(initialStates));
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

  then(description: string, callback: (states: State[]) => any) {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: State[]) => {
      this.checkPrevStates(prevValues);

      const ret = callback(prevValues);
      if (ret === undefined) {
        return prevValues;
      }
      if (!this.isArrayOfStates(ret)) {
        // tslint:disable-next-line: max-line-length
        throw new Error('"then" must return an array of State objects, or you can return undefined to leave everything unchanged');
      }
      return ret;
    });
    return this;
  }

  map(description: string, callback: (current: any, state: State, index: number) => any): Task {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: State[]) => {
      this.checkPrevStates(prevValues);

      this.reporter.printTitle(`➡️  map: ${description}`);
      const promises = prevValues.map((element: State, index: number) => {
        const ret = callback(element.data, element, index);
        if (ret === undefined) {
          this.throwReturnUndefined('map');
        }
        return ret;
      });
      const waitPromise = Promise.all(promises).then((values: any[]) => {
        return values.map((item, index) => {
          return new State(prevValues[index].context, item);
        });
      });
      this.reporter.printInfo(`${prevValues.length} state(s)`);
      return waitPromise;
    });
    return this;
  }

  filter(description: string, callback: (current: any, state: State, index: number) => boolean): Task {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: State[]) => {
      this.checkPrevStates(prevValues);

      this.reporter.printTitle(`✂️  filter: ${description}`);
      const newValues = prevValues.filter((element, index) => {
        const ret = callback(element.data, element, index);
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
    this.promise = this.promise.then((prevValues: State[]) => {
      this.checkPrevStates(prevValues);

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

  private isArrayOfStates(states: any) {
    if (!Array.isArray(states)) {
      return false;
    }
    if (states.length) {
      return states[0] instanceof State;
    }
    return true;
  }

  private checkPrevStates(states: any) {
    if (!this.isArrayOfStates(states)) {
      this.throwInvalidStates(states);
    }
  }

  private throwInvalidStates(value: any) {
    throw new Error(`The resolved value of Promise should be an array of State objects. It should not be "${value}"`);
  }

  private checkStringArgument(name: string, arg: any) {
    if (typeof arg !== 'string') {
      throw new Error(`The argument "${name}" should be a string`);
    }
  }

  private checkFunctionArgument(name: string, arg: any) {
    if (typeof arg !== 'function') {
      throw new Error(`The argument "${name}" should be a function`);
    }
  }

  private throwReturnUndefined(funcName: string) {
    throw new Error(`"${funcName}" returns undefined(did you forget to add a return statement?)`);
  }
}
