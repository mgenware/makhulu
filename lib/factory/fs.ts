import Context from '../context';
import Task from '../task';
import State from '../state';
import * as globby from 'globby';
import * as fs from 'fs';

export default class FSFactory {
  static fileNames(glob: string): Task {
    return Task.fromPromise(globby(glob));
  }
}
