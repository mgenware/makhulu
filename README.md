# makhulu

[![Build Status](https://github.com/mgenware/makhulu/workflows/Build/badge.svg)](https://github.com/mgenware/makhulu/actions)
[![MEAN Module](https://img.shields.io/badge/MEAN%20Module-TypeScript-blue.svg?style=flat-square)](https://github.com/mgenware/MEAN-Module)
[![npm version](https://img.shields.io/npm/v/makhulu.svg?style=flat-square)](https://npmjs.com/package/makhulu)
[![Node.js Version](http://img.shields.io/node/v/makhulu.svg?style=flat-square)](https://nodejs.org/en/)

<img width="150" height="192" src="makhulu.jpg" alt="makhulu">

🦁 Simple and parallel Node.js task runner

- Parallel, all functions are async
- Simple, no need to write plugins/wrappers, do everything in plain TypeScript / JavaScript
- Strongly typed, supports TypeScript out of the box

## Installation

```sh
yarn add makhulu
```

## A step-by-step example with comments

> More examples at https://github.com/mgenware/makhulu-examples

Use terserjs to uglify all .js files in `files` folder, and merge the results into one file and write it to `dist/bundle.js`:

```ts
/**
 * Prerequisites:
 * Please install the required packages first:
 * `yarn add makhulu terser`
 */
import * as mk from 'makhulu';
import { minify } from 'terser';

(async () => {
  // Select all .js files as initial data list.
  const srcDir = './files/';
  const files = await mk.fs.src(srcDir, '**/*.js');
  /**
   * Now the data list is something like:
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'a.js',
   *    },
   *    {
   *      SrcDir: './files/',
   *      FilePath: 'sub/b/js',
   *    },
   *    ...
   * ]
   */

  // Print out data list file paths using `printsRelativeFile`.
  await files.forEach('Source files', mk.fs.printsRelativeFile);

  // Read file contents, now each data entry contains file contents.
  await files.map('Read files', mk.fs.readToString);
  /**
   * Now the data list is like (note that "Read file" only adds attributes to the data list, all previous attributes are preserved):
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'a.js',
   *      Content: 'blabla',
   *    },
   *    {
   *      SrcDir: './files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'blabla',
   *    },
   *    ...
   * ]
   */

  // You can change the content to whatever you want, e.g. uglify the content.
  await files.map('Uglify', async (data) => {
    const content = data[mk.fs.FileContent] as string;
    const uglifyRes = await minify(content);
    data[mk.fs.FileContent] = uglifyRes.code;
    return data;
  });
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './files/',
   *      FilePath: 'a.js',
   *      Content: 'Uglified content ...',
   *    },
   *    {
   *      SrcDir: './files/',
   *      FilePath: 'sub/b/js',
   *      Content: 'Uglified content ...',
   *    },
   *    ...
   * ]
   */

  // Now let's merge these files into one file.
  // We need to create a new data list.
  await files.reset('Merge files', async (dataList) => {
    // The name of the merged file.
    const destPath = 'bundle.js';
    // Merge contents of all files into a single string.
    let contents = '';
    dataList.forEach((d) => {
      contents += d[mk.fs.FileContent] as string;
    });
    // Create a new `DataObject`.
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
   *      SrcDir: './files/',
   *      FilePath: 'bundle.js',
   *      Content: 'Merged content',
   *    },
   * ]
   */

  // Call `writeToDirectory` to save the data list to disk, in this case, the `dist/bundle.js` we just created.
  await files.map('Write files', mk.fs.writeToDirectory(`./dist/`));
  await files.forEach('Dest files', mk.fs.printsDestFile);
  /**
   * Now the data list is like:
   * [
   *   {
   *      SrcDir: './dist/',
   *      FilePath: 'bundle.js',
   *      Content: 'Merged content',
   *      DestFilePath: './dist/bundle.js',
   *    },
   * ]
   */
})();
```

Sample output:

```
🦁 Job started
> 2 item(s)
[
  { 'file.relative_file': 'a.js', 'file.src_dir': './files/' },
  { 'file.relative_file': 'sub/b.js', 'file.src_dir': './files/' }
]
> Done in 2ms
🦁 Source files
a.js
sub/b.js
[
  { 'file.relative_file': 'a.js', 'file.src_dir': './files/' },
  { 'file.relative_file': 'sub/b.js', 'file.src_dir': './files/' }
]
> Done in 2ms
🦁 Read files
[
  {
    'file.relative_file': 'a.js',
    'file.src_dir': './files/',
    'file.content': '<file contents>'
  },
  {
    'file.relative_file': 'sub/b.js',
    'file.src_dir': './files/',
    'file.content': '<file contents>'
  }
]
> Done in 3ms
🦁 Uglify
[
  {
    'file.relative_file': 'a.js',
    'file.src_dir': './files/',
    'file.content': '<file contents>'
  },
  {
    'file.relative_file': 'sub/b.js',
    'file.src_dir': './files/',
    'file.content': '<file contents>'
  }
]
> Done in 16ms
🦁 Merge files
> 2 --> 1 item(s)
[
  {
    'file.src_dir': './files/',
    'file.relative_file': 'bundle.js',
    'file.content': '<file contents>'
  }
]
> Done in 1ms
🦁 Write files
[
  {
    'file.src_dir': './files/',
    'file.relative_file': 'bundle.js',
    'file.content': '<file contents>',
    'file.dest_file': 'dist/bundle.js'
  }
]
> Done in 4ms
🦁 Dest files
dist\bundle.js
[
  {
    'file.src_dir': './files/',
    'file.relative_file': 'bundle.js',
    'file.content': '<file contents>',
    'file.dest_file': 'dist/bundle.js'
  }
]
> Done in 7ms
```

## Common Errors

### File content not found on data object

This happens in `writeToDirectory` when it gets a `null` or `undefined` when calling `DataObject.get(FS.FileContent)`. Possible reasons:

- You forgot to call `readToString`, or called `readToString` without the `await` keyword before calling `writeToDirectory`.
- You accidentally set the data entry value to `null` or `undefined`, if you want to write to an empty file, set it to an empty string (`''`), or if you want to remove this file, use `DataList.filter` or `DataList.reset` instead.

### Relative path not found on data object

`writeToDirectory` cannot locate the source path of a file, you forgot to call `fs.src` before `writeToDirectory`?
