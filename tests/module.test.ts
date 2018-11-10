import { promisify } from 'util';
import * as fs from 'fs';
const statAsync = promisify(fs.stat);

test('Verify type definition files', async () => {
  expect((await statAsync('./dist/main.d.ts')).isFile()).toBeTruthy();
});
