import DataList from './dataList';
import * as globby from 'globby';

export default class FS {
  static get FileType(): string {
    return 'FILE';
  }

  static fileDataList(values: string[]): DataList<string> {
    return new DataList(values, s => new Map<string, unknown>([[FS.FileType, s]]));
  }

  static async globAsync(patterns: string | string[], options?: object): Promise<DataList<string>> {
    const paths = await globby(patterns, options);
    return FS.fileDataList(paths);
  }
}
