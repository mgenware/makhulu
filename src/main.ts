export { default as DataList, IData } from './dataList';
export { default as fs } from './fs';

process.on('unhandledRejection', (reason, p) => {
  throw new Error('Unhandled error at: ' + p + 'reason: ' + reason);
});
