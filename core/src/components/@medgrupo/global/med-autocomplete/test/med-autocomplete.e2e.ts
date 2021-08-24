import { newE2EPage } from '@stencil/core/testing';

describe('med-autocomplete', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-autocomplete></med-autocomplete>');

    const element = await page.find('med-autocomplete');
    expect(element).toHaveClass('hydrated');
  });
});
