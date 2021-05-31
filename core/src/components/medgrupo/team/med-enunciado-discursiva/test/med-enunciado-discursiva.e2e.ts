import { newE2EPage } from '@stencil/core/testing';

describe('med-enunciado-discursiva', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-enunciado-discursiva></med-enunciado-discursiva>');

    const element = await page.find('med-enunciado-discursiva');
    expect(element).toHaveClass('hydrated');
  });
});
