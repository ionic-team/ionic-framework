import { newE2EPage } from '@stencil/core/testing';

describe('med-titulo-materia', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-titulo-materia></med-titulo-materia>');

    const element = await page.find('med-titulo-materia');
    expect(element).toHaveClass('hydrated');
  });
});
