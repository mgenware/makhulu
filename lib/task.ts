import State from './state';
import IReporter from './reporter';
import DefaultReporter from './reporters/defaultReporter';
import EmptyReporter from './reporters/emptyReporter';
const Promise = require('bluebird') as any;

export default class Task {
  private reporter: IReporter;
  
  private constructor(public promise: any) {
    this.reporter = new DefaultReporter();
  }

  setReporter(rep: IReporter|null) {
    if (rep) {
      this.reporter = rep;
    } else {
      this.reporter = new EmptyReporter;
    }
  }

  static fromPromise(promise: any) {
    return new Task(promise);
  }

  static fromInitialStates(initialStates: State[]) {
    return new Task(Promise.resolve(initialStates));
  }

  then(description: string, callback: (values: any[], states: State[]) => any) {
    this.checkStringArgument('description', description);
    this.checkFunctionArgument('callback', callback);

    this.promise = this.promise.then((prevValues: State[]) => {
      this.checkPrevStates(prevValues);

      const ret = callback(prevValues.map(state => state.data), prevValues);
      if (ret === undefined) {
        return prevValues;
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
        return ret;
      });
      let waitPromise = Promise.all(promises).then((values: any[]) => {
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
        return callback(element.data, element, index);
      });
      if (newValues.length == prevValues.length) {
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
        console.log(`[${index}] Value: ${value.data} Context: ${value.context.toString()}`);
      });
      return prevValues;
    });
    return this;
  }

  private checkPrevStates(states: any): State[] {
    if (!states) {
      return [];
    }
    if (!Array.isArray(states)) {
      this.throwInvalidStates(states);
    }
    const array: State[] = states;
    if (array.length) {
      if (!(array[0] instanceof State)) {
        this.throwInvalidStates(states);
      }
    }
    return [];
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
}
