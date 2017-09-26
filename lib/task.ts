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
    this.reporter.print(`➡️`);

    this.promise = this.promise.then((prevValues: State[]) => {
      const promises = prevValues.map((element: State, index: number) => {
        const ret = callback(element.data, index, element);
        return ret;
      });
      let waitPromise = Promise.all(promises).then((values: any[]) => {
        return values.map((item, index) => {
          return new State(prevValues[index].context, item);
        });
      }).then((values) => {
        return values;
      });
      return waitPromise;
    });
    return this;
  }

  filter(callback: (current: any, index: number, state: State) => boolean): any[] {
    this.reporter.print(`✂️`);
    return null;
    // return this.states.filter((item, index) => {
    //   return callback(item.data, index, item);
    // });
  }
}
