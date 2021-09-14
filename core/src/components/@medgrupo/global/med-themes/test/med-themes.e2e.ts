import { newE2EPage } from '@stencil/core/testing';

describe('med-temas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-temas></med-temas>');

    const element = await page.find('med-temas');
    expect(element).toHaveClass('hydrated');
  });
});
