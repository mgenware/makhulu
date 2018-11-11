export { default as DataList, DataMap } from './dataList';
export { default as fs } from './fs';
export { setLoggingEnabled } from './log';

process.on('unhandledRejection', reason => {
  throw new Error('Unhandled error: ' + reason);
});
