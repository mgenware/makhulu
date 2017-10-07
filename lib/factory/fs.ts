import Context from '../context';
import Task from '../task';
import State from '../state';
import * as globby from 'globby';
import * as fs from 'fs';

export default class FSFactory {
  static relativePathContext: string = 'makhulu.rpath';

  static glob(glob: string): Task {
    return Task.fromPromise(globby(glob).then((names) => {
      return names.map((n) => {
        const state = new State(null, n);
        state.context.setValue(FSFactory.relativePathContext, n);
        return state;
      });
    }));
  }
}
