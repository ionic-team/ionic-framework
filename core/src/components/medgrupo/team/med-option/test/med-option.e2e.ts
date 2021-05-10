import { newE2EPage } from '@stencil/core/testing';

describe('med-option', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-option></med-option>');

    const element = await page.find('med-option');
    expect(element).toHaveClass('hydrated');
  });
});
