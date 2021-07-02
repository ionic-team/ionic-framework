import { newE2EPage } from '@stencil/core/testing';

describe('med-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-accordion></med-accordion>');

    const element = await page.find('med-accordion');
    expect(element).toHaveClass('hydrated');
  });
});
