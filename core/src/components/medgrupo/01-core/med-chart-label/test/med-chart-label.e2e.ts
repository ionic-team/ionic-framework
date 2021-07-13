import { newE2EPage } from '@stencil/core/testing';

describe('med-chart-label', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-chart-label></med-chart-label>');

    const element = await page.find('med-chart-label');
    expect(element).toHaveClass('hydrated');
  });
});
