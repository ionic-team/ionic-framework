import { newE2EPage } from '@stencil/core/testing';

describe('med-font-zoom', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-font-zoom></med-font-zoom>');

    const element = await page.find('med-font-zoom');
    expect(element).toHaveClass('hydrated');
  });
});
