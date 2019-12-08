import { promisify } from 'util';
import * as fs from 'fs';
import * as assert from 'assert';
const statAsync = promisify(fs.stat);

it('Verify type definition files', async () => {
  assert.ok((await statAsync('./dist/main.d.ts')).isFile());
});
