import { newE2EPage } from '@stencil/core/testing';

describe('med-offline', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-offline></med-offline>');

    const element = await page.find('med-offline');
    expect(element).toHaveClass('hydrated');
  });
});
