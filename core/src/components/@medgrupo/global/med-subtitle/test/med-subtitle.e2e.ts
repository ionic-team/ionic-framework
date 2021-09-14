import { newE2EPage } from '@stencil/core/testing';

describe('med-subtitle', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-subtitle></med-subtitle>');

    const element = await page.find('med-subtitle');
    expect(element).toHaveClass('hydrated');
  });
});
