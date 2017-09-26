import State from './state';
import IReporter from './reporter';
import DefaultReporter from './reporters/defaultReporter';
const Promise = require('bluebird') as any;

export default class Task {
  reporter: IReporter;
  promise: any;
  constructor(public states: State[]) {
    this.reporter = new DefaultReporter();
    this.promise = Promise.resolve(states);
  }

  map(callback: (current: any, index: number, state: State) => any): Task {
    this.promise = this.promise.then((prevValues: State[]) => {
      this.reporter.print(`===== ➡️  map =====`);
      const promises = prevValues.map((element: State, index: number) => {
        const ret = callback(element.data, index, element);
        return ret;
      });
      let waitPromise = Promise.all(promises).then((values: any[]) => {
        return values.map((item, index) => {
          return new State(prevValues[index].context, item);
        });
      });
      return waitPromise;
    });
    return this;
  }

  filter(callback: (current: any, index: number, state: State) => boolean): Task {
    this.promise = this.promise.then((prevValues: State[]) => {
      this.reporter.print(`===== ✂️  filter =====`);
      const newValues = prevValues.filter((element, index) => {
        return callback(element.data, index, element);
      });
      return newValues;
    });
    return this;
  }

  print(): Task {
    this.promise = this.promise.then((prevValues: State[]) => {
      this.reporter.print(`===== 😀  print =====`);
      prevValues.forEach((value, index) => {
        console.log(`${index} Value: ${value.data} Context: ${value.context}`);
      });
      return prevValues;
    });
    return this;
  }
}
