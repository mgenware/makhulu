import Context from '../context';
import Task from '../task';
import State from '../state';

export default class JSFactory {
  static array(array: any[], contextFactory: (i: any) => Context = null): Task {
    if (array == null) {
      throw new Error('array cannot be null');
    }
    let states: State[] = null;
    if (contextFactory == null) {
      states = array.map(i => new State(null, i));
    } else {
      states = array.map(i => new State(contextFactory(i), i));
    }

    console.log(' -- create new tasks ', states);
    return new Task(states);
  }
}
