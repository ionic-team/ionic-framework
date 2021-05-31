import { newSpecPage } from '@stencil/core/testing';
import { MedCartaoResposta } from '../med-cartao-resposta';

describe('med-cartao-resposta', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedCartaoResposta],
      html: `<med-cartao-resposta></med-cartao-resposta>`,
    });
    expect(page.root).toEqualHtml(`
      <med-cartao-resposta>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-cartao-resposta>
    `);
  });
});
