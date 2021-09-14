import { newE2EPage } from '@stencil/core/testing';

describe('med-alternativas-a', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-alternativas-a></med-alternativas-a>');

    const element = await page.find('med-alternativas-a');
    expect(element).toHaveClass('hydrated');
  });
});
