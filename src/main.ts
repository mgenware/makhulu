export { default as DataList, DataMap } from './dataList';
export { default as fs } from './fs';

process.on('unhandledRejection', reason => {
  throw new Error('Unhandled error: ' + reason);
});
