# makhulu

[![Build Status](https://github.com/mgenware/makhulu/workflows/Build/badge.svg)](https://github.com/mgenware/makhulu/actions)
[![MEAN Module](https://img.shields.io/badge/MEAN%20Module-TypeScript-blue.svg?style=flat-square)](https://github.com/mgenware/MEAN-Module)
[![npm version](https://img.shields.io/npm/v/makhulu.svg?style=flat-square)](https://npmjs.com/package/makhulu)
[![Node.js Version](http://img.shields.io/node/v/makhulu.svg?style=flat-square)](https://nodejs.org/en/)

<img width="150" height="192" src="makhulu.jpg" alt="ky">

🦁 Simple and parallel Node.js task runner

- Parallel, all functions are written in async
- Simple, no need to write plugins/wrappers, do everything in plain TypeScript
- Strongly typed, supports TypeScript out of the box

## Installation

```sh
yarn add makhulu
```

## Getting started

## Examples

> More examples at https://github.com/mgenware/makhulu-examples

Use the latest uglifyjs to uglify all JS files in `./test_files/`, then merge the results into one single file `merge.js` and save it to `./dist_files`:

```ts
/**
 * Assuming you have installed the following packages:
 * makhulu, uglify-js, @types/uglify-js
 */
import * as mk from 'makhulu';
import { minify } from 'uglify-js';
import * as nodepath from 'path';

(async () => {
  const srcDir = './test_files/';
  // Select all js files as the initial data list
  const files = await mk.fs.src(srcDir, '**/*.js');
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'a.js',
   *    },
   *    {
   *      SrcDir: './test_files/',
   *      FilePath: 'sub/b/js',
   *    },
   *    ...
   * ]
   */

  // Prints src file paths using printsRelativeFile
  await files.forEach('Source files', mk.fs.printsRelativeFile);

  // Read file paths to string contents, now data list contains file content data
  await files.map('Read files', mk.fs.readToString);
  /**
   * Now the data list is like (note that this only adds attributes to the target data map, all previous attributes are preserved):
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'a.js',
   *      Content: 'blabla',
   *    },
   *    {
   *      SrcDir: './test_files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'blabla',
   *    },
   *    ...
   * ]
   */

  // You can modify the content to whatever you want, e.g. uglify the content
  await files.map('Uglify', async data => {
    const content = data[mk.fs.FileContent] as string;
    const uglifyRes = minify(content);
    if (uglifyRes.error) {
      throw uglifyRes.error;
    }
    data[mk.fs.FileContent] = uglifyRes.code;
    return data;
  });
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'a.js',
   *      Content: 'Uglified content ...',
   *    },
   *    {
   *      SrcDir: './test_files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'Uglified content ...',
   *    },
   *    ...
   * ]
   */

  // Another example of modify the content, we merge all the content of previous files into one, and manually creates the DataObject
  await files.reset('Merge into one file', async dataList => {
    // set merged file as "bundle.js"
    const destPath = 'bundle.js';
    // merge contents of all files into a single string
    let contents = '';
    dataList.forEach(d => {
      contents += d[mk.fs.FileContent] as string;
    });
    // create a new DataObject
    const bundleFileObject = {
      [mk.fs.SrcDir]: srcDir,
      [mk.fs.RelativeFile]: destPath,
      [mk.fs.FileContent]: contents,
    };
    return [bundleFileObject];
  });
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'merged.js',
   *      Content: 'Merged content',
   *    },
   * ]
   */

  // Call writeToDirectory to save all files to a directory, in this case, only one file called `merged.js` which we created
  await files.map(
    'Write files',
    mk.fs.writeToDirectory(`./dist_files/${nodepath.basename(__dirname)}`),
  );
  await files.forEach('Dest files', mk.fs.printsDestFile);
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './test_files/',
   *      FilePath: 'merged.js',
   *      Content: 'Merged content',
   *      DestFilePath: './dist_files/uglifyjs-and-merge/merged.js',
   *    },
   * ]
   */
})();
```

Sample output:

```
🦁 Job started
> 3
> Done in 1ms
🦁 Source files
a.js
b.js
subdir/c.js
> Done in 3ms
🦁 Read files
> Done in 51ms
🦁 Uglify
> Done in 19ms
🦁 Merge into one file
> 3 >> 1
> Done in 1ms
🦁 Write files
> Done in 4ms
🦁 Dest files
dist_files/uglifyjs-and-merge/bundle.js
> Done in 1ms
```

## Common Errors

### File content not found on data object

This happens when you call `writeToDirectory` and `DataObject.get(FS.FileContent)` returns `null` or `undefined`, possible reasons:

- You forgot to call `readToString`, or called `readToString` without the `await` keyword before a call to `writeToDirectory`.
- You accidentally set this value to `null` or `undefined`, if you want to write to an empty file, set it to an empty string (`''`), or if you want to remove this file, use `DataList.filter` or `DataList.reset` instead.

### Relative path not found on data object

`writeToDirectory` cannot locate the source path of a file, you forgot to call `fs.src` before `writeToDirectory`?
