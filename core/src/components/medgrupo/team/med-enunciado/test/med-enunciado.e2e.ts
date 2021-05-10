import { newE2EPage } from '@stencil/core/testing';

describe('med-enunciado', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-enunciado></med-enunciado>');

    const element = await page.find('med-enunciado');
    expect(element).toHaveClass('hydrated');
  });
});
