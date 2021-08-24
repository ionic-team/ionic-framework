import { newE2EPage } from '@stencil/core/testing';

describe('med-rating', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-rating></med-rating>');

    const element = await page.find('med-rating');
    expect(element).toHaveClass('hydrated');
  });
});
