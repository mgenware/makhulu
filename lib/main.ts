export { default as IReporter } from './reporter';
export { default as DefaultReporter } from './reporters/defaultReporter';
export { default as Context } from './context';
export { default as js } from './factory/js';
export { default as fs } from './factory/fs';
export { default as State } from './state';
export { default as Task } from './task';

/* tslint:disable:no-console */
process.on('unhandledRejection', (err) => {
  console.log('Caught unhandledRejection');
  console.log(err);
});
