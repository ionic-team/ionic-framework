import { newSpecPage } from '@stencil/core/testing';
import { MedEnunciado } from '../med-enunciado';

describe('med-enunciado', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedEnunciado],
      html: `<med-enunciado></med-enunciado>`,
    });
    expect(page.root).toEqualHtml(`
      <med-enunciado>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-enunciado>
    `);
  });
});
