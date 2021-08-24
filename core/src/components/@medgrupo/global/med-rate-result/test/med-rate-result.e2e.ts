import { newE2EPage } from '@stencil/core/testing';

describe('med-rate-result', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-rate-result></med-rate-result>');

    const element = await page.find('med-rate-result');
    expect(element).toHaveClass('hydrated');
  });
});
