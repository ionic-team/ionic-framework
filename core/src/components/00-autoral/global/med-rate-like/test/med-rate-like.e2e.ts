import { newE2EPage } from '@stencil/core/testing';

describe('med-rate-like', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-rate-like></med-rate-like>');

    const element = await page.find('med-rate-like');
    expect(element).toHaveClass('hydrated');
  });
});
