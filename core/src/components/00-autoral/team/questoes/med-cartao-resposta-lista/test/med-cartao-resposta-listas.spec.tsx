import { newSpecPage } from '@stencil/core/testing';
import { MedCartaoRespostaListas } from '../med-cartao-resposta-listas';

describe('med-cartao-resposta-listas', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedCartaoRespostaListas],
      html: `<med-cartao-resposta-listas></med-cartao-resposta-listas>`,
    });
    expect(page.root).toEqualHtml(`
      <med-cartao-resposta-listas>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-cartao-resposta-listas>
    `);
  });
});
