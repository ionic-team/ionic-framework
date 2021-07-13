import { newE2EPage } from '@stencil/core/testing';

describe('med-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-divider></med-divider>');

    const element = await page.find('med-divider');
    expect(element).toHaveClass('hydrated');
  });
});
