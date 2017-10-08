import * as globby from 'globby';
import Context from '../context';
import State from '../state';
import Task from '../task';
import * as fs from 'fs';
const writeFile = require('write') as any;
const Promise = require('bluebird') as any;
const nodeReadFileAsync = Promise.promisify(fs.readFile);

export default class FSFactory {
  // ck stands for Context Key.
  static ckRelativePath: string = 'makhulu.rpath';

  static glob(glob: string): Task {
    return Task.fromPromise(globby(glob).then((names) => {
      return names.map((n) => {
        const state = new State(null, n);
        state.context.setValue(FSFactory.ckRelativePath, n);
        return state;
      });
    }));
  }

  static getRelativePathFromContext(context: Context) {
    return context.getValue(FSFactory.ckRelativePath);
  }

  static readFileAsync(...args: any[]): any {
    return nodeReadFileAsync(...args);
  }

  static writeFileAsync(...args: any[]): any {
    return writeFile(...args);
  }
}
