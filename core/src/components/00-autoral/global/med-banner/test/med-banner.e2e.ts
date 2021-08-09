import { newE2EPage } from '@stencil/core/testing';

describe('med-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-banner></med-banner>');

    const element = await page.find('med-banner');
    expect(element).toHaveClass('hydrated');
  });
});
