import { newSpecPage } from '@stencil/core/testing';
import { MontaProvasPlusminus } from '../monta-provas-plusminus';

describe('monta-provas-plusminus', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MontaProvasPlusminus],
      html: `<monta-provas-plusminus></monta-provas-plusminus>`,
    });
    expect(page.root).toEqualHtml(`
      <monta-provas-plusminus>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </monta-provas-plusminus>
    `);
  });
});
