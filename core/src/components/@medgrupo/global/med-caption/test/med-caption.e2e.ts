import { newE2EPage } from '@stencil/core/testing';

describe('med-caption', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-caption></med-caption>');

    const element = await page.find('med-caption');
    expect(element).toHaveClass('hydrated');
  });
});
