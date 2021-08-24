import { newSpecPage } from '@stencil/core/testing';
import { MedTituloMateria } from '../med-titulo-materia';

describe('med-titulo-materia', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedTituloMateria],
      html: `<med-titulo-materia></med-titulo-materia>`,
    });
    expect(page.root).toEqualHtml(`
      <med-titulo-materia>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-titulo-materia>
    `);
  });
});
