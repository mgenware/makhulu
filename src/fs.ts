import DataList, { IData } from './dataList';
import * as globby from 'globby';
import { promisify } from 'util';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);

export default class FS {
  static get RelativeFilePath(): string {
    return 'file.path.relative';
  }

  static get AbsoluteFilePath(): string {
    return 'file.path.absolute';
  }

  static get FileContent(): string {
    return 'file.content';
  }

  static async glob(patterns: string | string[], options?: object): Promise<DataList> {
    const paths = await globby(patterns, options);
    return new DataList(paths.map(p => ({ [FS.RelativeFilePath]: p })));
  }

  static async fileToContentString(d: IData): Promise<IData> {
    const path = d[FS.RelativeFilePath] as string;
    if (!path) {
      throw new Error(`fileToContentStringAsync: Relative path not found on data object "${d}"`);
    }
    const content = await readFileAsync(path, 'utf8');
    return {
      ...d,
      [FS.FileContent]: content,
    };
  }
}
