import { newE2EPage } from '@stencil/core/testing';

describe('med-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-header></med-header>');

    const element = await page.find('med-header');
    expect(element).toHaveClass('hydrated');
  });
});
