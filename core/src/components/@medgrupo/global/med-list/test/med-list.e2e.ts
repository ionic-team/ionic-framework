import { newE2EPage } from '@stencil/core/testing';

describe('med-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-list></med-list>');

    const element = await page.find('med-list');
    expect(element).toHaveClass('hydrated');
  });
});
