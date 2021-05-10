import { newE2EPage } from '@stencil/core/testing';

describe('med-alternativas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-alternativas></med-alternativas>');

    const element = await page.find('med-alternativas');
    expect(element).toHaveClass('hydrated');
  });
});
