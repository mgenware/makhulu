import Context from '../context';
import Task from '../task';
import State from '../state';

export default class JSFactory {
  // construct a Task from a JavaScript array
  static array(array: any[]): Task {
    if (array == null) {
      throw new Error('array cannot be null');
    }

    const states = array.map(n => new State(null, n));
    return Task.fromInitialStates(states);
  }
}
