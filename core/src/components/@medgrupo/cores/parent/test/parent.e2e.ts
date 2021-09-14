import { newE2EPage } from '@stencil/core/testing';

describe('tst-parent', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<tst-parent></tst-parent>');

    const element = await page.find('tst-parent');
    expect(element).toHaveClass('hydrated');
  });
});
