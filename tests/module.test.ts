import * as fs from 'fs';

test('Verify type definition files', () => {
  expect(fs.statSync('./dist/main.d.ts').isFile()).toBeTruthy();
});
