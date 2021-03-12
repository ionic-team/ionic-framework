import { newE2EPage } from '@stencil/core/testing';

describe('med-navbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-navbar></med-navbar>');

    const element = await page.find('med-navbar');
    expect(element).toHaveClass('hydrated');
  });
});
