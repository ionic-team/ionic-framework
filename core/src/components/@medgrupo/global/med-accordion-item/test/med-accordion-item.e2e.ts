import { newE2EPage } from '@stencil/core/testing';

describe('med-accordion-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-accordion-item></med-accordion-item>');

    const element = await page.find('med-accordion-item');
    expect(element).toHaveClass('hydrated');
  });
});
