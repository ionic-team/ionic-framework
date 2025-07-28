import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('display css utility classes', () => {
  let css: string;

  test.beforeAll(() => {
    css = fs.readFileSync(path.resolve(__dirname, '../../../css/display.css'), 'utf8');
  });

  const INFIXES = ['', '-sm', '-md', '-lg', '-xl'];

  // TODO(FW-6697): remove `ion-hide classes` test
  test('ion-hide classes', () => {
    expect(css).toContain('.ion-hide');

    const values = ['up', 'down'];

    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-hide${infix}-${value}`);
      }
    }
  });

  test('ion-display classes', () => {
    const values = [
      'none',
      'inline',
      'inline-block',
      'block',
      'flex',
      'inline-flex',
      'grid',
      'inline-grid',
      'table',
      'table-cell',
      'table-row',
    ];

    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-display${infix}-${value}`);
      }
    }
  });
});
