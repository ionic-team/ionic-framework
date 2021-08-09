import { newE2EPage } from '@stencil/core/testing';

describe('med-toolbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-toolbar></med-toolbar>');

    const element = await page.find('med-toolbar');
    expect(element).toHaveClass('hydrated');
  });
});
