import { newE2EPage } from '@stencil/core/testing';

describe('med-cartao-resposta', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-cartao-resposta></med-cartao-resposta>');

    const element = await page.find('med-cartao-resposta');
    expect(element).toHaveClass('hydrated');
  });
});
