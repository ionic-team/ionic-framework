import { newE2EPage } from '@stencil/core/testing';

describe('med-chart-donut', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-chart-donut></med-chart-donut>');

    const element = await page.find('med-chart-donut');
    expect(element).toHaveClass('hydrated');
  });
});
