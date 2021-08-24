import { newE2EPage } from '@stencil/core/testing';

describe('med-rate-bar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-rate-bar></med-rate-bar>');

    const element = await page.find('med-rate-bar');
    expect(element).toHaveClass('hydrated');
  });
});
