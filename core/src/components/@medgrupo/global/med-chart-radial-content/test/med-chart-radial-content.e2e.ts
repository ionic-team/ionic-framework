import { newE2EPage } from '@stencil/core/testing';

describe('med-chart-radial-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-chart-radial-content></med-chart-radial-content>');

    const element = await page.find('med-chart-radial-content');
    expect(element).toHaveClass('hydrated');
  });
});
