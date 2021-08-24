import { newE2EPage } from '@stencil/core/testing';

describe('med-tiles', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-tiles></med-tiles>');

    const element = await page.find('med-tiles');
    expect(element).toHaveClass('hydrated');
  });
});
