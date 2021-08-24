import { newE2EPage } from '@stencil/core/testing';

describe('med-chart-radial-label', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-chart-radial-label></med-chart-radial-label>');

    const element = await page.find('med-chart-radial-label');
    expect(element).toHaveClass('hydrated');
  });
});
