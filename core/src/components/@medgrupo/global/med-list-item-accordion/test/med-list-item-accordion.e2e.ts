import { newE2EPage } from '@stencil/core/testing';

describe('med-list-item-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-list-item-accordion></med-list-item-accordion>');

    const element = await page.find('med-list-item-accordion');
    expect(element).toHaveClass('hydrated');
  });
});
