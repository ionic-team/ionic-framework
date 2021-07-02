import { newE2EPage } from '@stencil/core/testing';

describe('med-agrupador', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-agrupador></med-agrupador>');

    const element = await page.find('med-agrupador');
    expect(element).toHaveClass('hydrated');
  });
});
