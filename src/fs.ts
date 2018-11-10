import DataList from './dataList';
import * as globby from 'globby';
import { promisify } from 'util';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);

export default class FS {
  static get FileType(): string {
    return 'FILE';
  }

  static fileList(values: string[]): DataList<string> {
    return new DataList(values, s => new Map<string, unknown>([[FS.FileType, s]]));
  }

  static async globAsync(patterns: string | string[], options?: object): Promise<DataList<string>> {
    const paths = await globby(patterns, options);
    return FS.fileList(paths);
  }

  static async fileToContentStringAsync(path: string): Promise<string> {
    return await readFileAsync(path, 'utf8');
  }
}
