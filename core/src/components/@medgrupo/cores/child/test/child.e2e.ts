import { newE2EPage } from '@stencil/core/testing';

describe('med-child', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-child></med-child>');

    const element = await page.find('med-child');
    expect(element).toHaveClass('hydrated');
  });
});
