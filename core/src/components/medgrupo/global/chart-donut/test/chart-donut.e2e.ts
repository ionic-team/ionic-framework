import { newE2EPage } from '@stencil/core/testing';

describe('chart-donut', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<chart-donut></chart-donut>');

    const element = await page.find('chart-donut');
    expect(element).toHaveClass('hydrated');
  });
});
