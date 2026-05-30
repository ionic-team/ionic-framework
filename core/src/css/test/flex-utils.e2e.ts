import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('flex-utils css utility classes', () => {
  let css: string;

  test.beforeAll(() => {
    css = fs.readFileSync(path.resolve(__dirname, '../../../css/flex-utils.css'), 'utf8');
  });

  const INFIXES = ['', '-sm', '-md', '-lg', '-xl'];

  test('align-content classes', () => {
    const values = ['start', 'end', 'center', 'between', 'around', 'stretch'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-align-content${infix}-${value}`);
      }
    }
  });

  test('align-items classes', () => {
    const values = ['start', 'center', 'end', 'stretch', 'baseline'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-align-items${infix}-${value}`);
      }
    }
  });

  test('align-self classes', () => {
    const values = ['start', 'end', 'center', 'stretch', 'baseline', 'auto'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-align-self${infix}-${value}`);
      }
    }
  });

  test('justify-content classes', () => {
    const values = ['start', 'center', 'end', 'around', 'between', 'evenly'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-justify-content${infix}-${value}`);
      }
    }
  });

  test('flex-direction classes', () => {
    const values = ['row', 'row-reverse', 'column', 'column-reverse'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-flex${infix}-${value}`);
      }
    }
  });

  test('flex-wrap classes', () => {
    const values = ['wrap', 'nowrap', 'wrap-reverse'];
    // TODO(FW-6697): remove all `ion-wrap-*` expects
    for (const value of values) {
      expect(css).toContain(`.ion-${value}`);
    }
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-flex${infix}-${value}`);
      }
    }
  });

  test('flex-fill classes', () => {
    const values = ['1', 'auto', 'initial', 'none'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-flex${infix}-${value}`);
      }
    }
  });

  test('flex-grow and flex-shrink classes', () => {
    const values = ['grow', 'shrink'];
    for (const value of values) {
      for (const infix of INFIXES) {
        expect(css).toContain(`.ion-flex${infix}-${value}-0`);
        expect(css).toContain(`.ion-flex${infix}-${value}-1`);
      }
    }
  });

  test('flex-order classes', () => {
    for (const infix of INFIXES) {
      expect(css).toContain(`.ion-order${infix}-first`);
      expect(css).toContain(`.ion-order${infix}-last`);
      for (let i = 0; i <= 12; i++) {
        expect(css).toContain(`.ion-order${infix}-${i}`);
      }
    }
  });
});
