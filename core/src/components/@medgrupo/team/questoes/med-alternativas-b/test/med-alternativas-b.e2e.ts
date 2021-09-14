import { newE2EPage } from '@stencil/core/testing';

describe('med-alternativas-b', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-alternativas-b></med-alternativas-b>');

    const element = await page.find('med-alternativas-b');
    expect(element).toHaveClass('hydrated');
  });
});
