import { newE2EPage } from '@stencil/core/testing';

describe('med-cartao-resposta-listas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-cartao-resposta-listas></med-cartao-resposta-listas>');

    const element = await page.find('med-cartao-resposta-listas');
    expect(element).toHaveClass('hydrated');
  });
});
