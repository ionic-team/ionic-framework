import { newE2EPage } from '@stencil/core/testing';

describe('med-list-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-list-item></med-list-item>');

    const element = await page.find('med-list-item');
    expect(element).toHaveClass('hydrated');
  });
});
