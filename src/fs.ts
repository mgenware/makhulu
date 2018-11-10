import DataList, { IData, MapFn } from './dataList';
import * as fastGlob from 'fast-glob';
import { throwIfFalsy } from 'throw-if-arg-empty';
import * as nodePath from 'path';
import * as mkdirp from 'make-dir';
import { promisify, inspect } from 'util';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export default class FS {
  static get RelativePath(): string {
    return 'file.path.relative';
  }

  static get SrcPath(): string {
    return 'file.path.src';
  }

  static get DestPath(): string {
    return 'file.path.dest';
  }

  static get FileContent(): string {
    return 'file.content';
  }

  static async src(baseDir: string, patterns?: string | string[], options?: object): Promise<DataList> {
    throwIfFalsy(baseDir, 'baseDir');
    if (baseDir.includes('*') || baseDir.includes('?')) {
      throw new Error(`"baseDir" looks like a glob, please specify "baseDir" as a valid file path and only use glob in the second "pattern" parameter, "baseDir" value: "${baseDir}"`);
    }

    if (!patterns || (Array.isArray(patterns) && patterns.length === 0)) {
      patterns = ['**/*'];
    }
    const paths = await fastGlob(patterns, {
      ...options,
      cwd: baseDir,
    });
    return new DataList((paths as string[]).map(p => ({
      [FS.RelativePath]: p,
      [FS.SrcPath]: nodePath.join(baseDir, p),
    })));
  }

  static async fileToContentString(d: IData): Promise<IData> {
    const path = FS.checkSrcPath(d, 'fileToContentString');
    const content = await readFileAsync(path, 'utf8');
    return {
      ...d,
      [FS.FileContent]: content,
    };
  }

  static saveToDirectory(dir: string): MapFn {
    throwIfFalsy(dir, 'dir');
    return async (d: IData) => {
      const src = FS.checkRelativePath(d, 'saveToDirectory');
      const content = FS.checkFileContent(d, 'saveToDirectory');
      const dest = nodePath.join(dir, src);

      await mkdirp(nodePath.dirname(dest));
      await writeFileAsync(dest, content);
      return {
        ...d,
        [FS.DestPath]: dest,
      } as IData;
    };
  }

  private static checkRelativePath(d: IData, fn: string): string {
    const path = d[FS.RelativePath] as string;
    if (!path) {
      throw new Error(`${fn}: Relative path not found on data object "${inspect(d)}"`);
    }
    return path;
  }

  private static checkSrcPath(d: IData, fn: string): string {
    const path = d[FS.SrcPath] as string;
    if (!path) {
      throw new Error(`${fn}: Relative path not found on data object "${inspect(d)}"`);
    }
    return path;
  }

  private static checkFileContent(d: IData, fn: string): string {
    const path = d[FS.FileContent] as string;
    if (!path) {
      throw new Error(`${fn}: File content not found on data object "${inspect(d)}"`);
    }
    return path;
  }
}
