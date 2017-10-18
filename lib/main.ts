export { default as IReporter } from './reporter';
export { default as DefaultReporter } from './reporters/defaultReporter';
export { default as Task } from './taskFactory';

/* tslint:disable:no-console */
process.on('unhandledRejection', (err) => {
  console.log('Caught unhandledRejection');
  console.log(err);
});
