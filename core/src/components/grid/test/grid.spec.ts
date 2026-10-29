import { forceUpdate } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Grid } from '../grid';

describe('ion-grid', () => {
  it('applies grid-fixed only when fixed is set', async () => {
    const page = await newSpecPage({ components: [Grid], html: `<ion-grid></ion-grid>` });
    const grid = page.body.querySelector('ion-grid')!;

    expect(grid.classList.contains('grid-fixed')).toBe(false);

    grid.fixed = true;
    forceUpdate(grid);
    await page.waitForChanges();

    expect(grid.classList.contains('grid-fixed')).toBe(true);
  });
});
