import { newE2EPage } from '@stencil/core/testing';

describe('med-accordion-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-accordion-list></med-accordion-list>');

    const element = await page.find('med-accordion-list');
    expect(element).toHaveClass('hydrated');
  });
});
