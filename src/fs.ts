import DataList, { DataObject, MapFn } from './dataList';
import * as fastGlob from 'fast-glob';
import { throwIfFalsy } from 'throw-if-arg-empty';
import * as nodePath from 'path';
import * as mkdirp from 'make-dir';
import { promisify, inspect } from 'util';
import log from './log';
import * as fs from 'fs';
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export default class FS {
  static get RelativeFile(): string {
    return 'file.relative_file';
  }

  static get DestFile(): string {
    return 'file.dest_file';
  }

  static get FileContent(): string {
    return 'file.content';
  }

  static get SrcDir(): string {
    return 'file.src_dir';
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
    return new DataList(
      (paths as string[]).map(p => {
        return DataObject.fromEntries(
          [FS.RelativeFile, p],
          [FS.SrcDir, baseDir],
        );
      }));
  }

  static async fileToContentString(d: DataObject): Promise<DataObject> {
    const path = FS.getSrcFile(d, 'fileToContentString');
    const content = await readFileAsync(path, 'utf8');
    return d.set(FS.FileContent, content);
  }

  static saveToDirectory(dir: string): MapFn {
    throwIfFalsy(dir, 'dir');
    return async (d: DataObject) => {
      const src = FS.checkRelativeFile(d, 'saveToDirectory');
      const content = FS.checkFileContent(d, 'saveToDirectory');
      const dest = nodePath.join(dir, src);

      await mkdirp(nodePath.dirname(dest));
      await writeFileAsync(dest, content);

      return d.set(FS.DestFile, dest);
    };
  }

  static async printsRelativeFile(d: DataObject): Promise<void> {
    log(d.get(FS.RelativeFile) as string);
  }

  static async printsDestFile(d: DataObject): Promise<void> {
    log(d.get(FS.DestFile) as string);
  }

  static getSrcFile(map: DataObject, description: string): string {
    const relativePath = FS.checkRelativeFile(map, description);
    const srcDir = FS.checkSrcDir(map, description);
    const srcFile = nodePath.join(srcDir, relativePath);
    return srcFile;
  }

  private static checkRelativeFile(d: DataObject, fn: string): string {
    const path = d.get(FS.RelativeFile) as string|null;
    if (!path) {
      throw new Error(`${fn}: Relative path not found on data object "${inspect(d)}"`);
    }
    return path;
  }

  private static checkSrcDir(d: DataObject, fn: string): string {
    const path = d.get(FS.SrcDir) as string|null;
    if (!path) {
      throw new Error(`${fn}: Src dir not found on data object "${inspect(d)}"`);
    }
    return path;
  }

  private static checkFileContent(d: DataObject, fn: string): string {
    const path = d.get(FS.FileContent) as string|null;
    if (!path) {
      throw new Error(`${fn}: File content not found on data object "${inspect(d)}"`);
    }
    return path;
  }
}
