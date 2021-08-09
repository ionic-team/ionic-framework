import { newE2EPage } from '@stencil/core/testing';

describe('med-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-tooltip></med-tooltip>');

    const element = await page.find('med-tooltip');
    expect(element).toHaveClass('hydrated');
  });
});
