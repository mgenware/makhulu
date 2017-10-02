import State from './state';
import IReporter from './reporter';
import DefaultReporter from './reporters/defaultReporter';
import EmptyReporter from './reporters/emptyReporter';
const Promise = require('bluebird') as any;

export default class Task {
  reporter: IReporter;
  promise: any;
  constructor(public states: State[]) {
    this.reporter = new DefaultReporter();
    this.promise = Promise.resolve(states);
  }

  then(callback: (values: any[], states: State[]) => any) {
    this.promise = this.promise.then((prevValues: State[]) => {
      const ret = callback(prevValues.map(state => state.data), prevValues);
      if (ret === undefined) {
        return prevValues;
      }
      return ret;
    });
    return this;
  } 

  map(callback: (current: any, index: number, state: State) => any): Task {
    this.promise = this.promise.then((prevValues: State[]) => {
      this.reporter.printTitle(`➡️  map`);
      const promises = prevValues.map((element: State, index: number) => {
        const ret = callback(element.data, index, element);
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

  filter(callback: (current: any, index: number, state: State) => boolean): Task {
    this.promise = this.promise.then((prevValues: State[]) => {
      this.reporter.printTitle(`✂️  filter`);
      const newValues = prevValues.filter((element, index) => {
        return callback(element.data, index, element);
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
      this.reporter.printTitle(`😀  print`);
      this.reporter.printInfo(`${prevValues.length} state(s)`);
      prevValues.forEach((value, index) => {
        console.log(`${index} Value: ${value.data} Context: ${value.context}`);
      });
      return prevValues;
    });
    return this;
  }
}
