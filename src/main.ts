export { default as DataList, DataObject } from './dataList';
export { default as fs, FSSrcOptions } from './fs';
export { setLoggingEnabled } from './log';
export * from './helpers';

process.on('unhandledRejection', (reason) => {
  throw new Error('Unhandled error: ' + reason);
});
