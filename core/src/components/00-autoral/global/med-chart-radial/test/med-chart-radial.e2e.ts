import { newE2EPage } from '@stencil/core/testing';

describe('med-chart-radial', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-chart-radial></med-chart-radial>');

    const element = await page.find('med-chart-radial');
    expect(element).toHaveClass('hydrated');
  });
});
