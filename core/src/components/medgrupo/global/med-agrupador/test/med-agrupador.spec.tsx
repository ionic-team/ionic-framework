import { newSpecPage } from '@stencil/core/testing';
import { MedAgrupador } from '../med-agrupador';

describe('med-agrupador', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAgrupador],
      html: `<med-agrupador></med-agrupador>`,
    });
    expect(page.root).toEqualHtml(`
      <med-agrupador>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-agrupador>
    `);
  });
});
