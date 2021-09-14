import { newSpecPage } from '@stencil/core/testing';
import { MedAlternativasA } from '../med-alternativas-a';

describe('med-alternativas-a', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAlternativasA],
      html: `<med-alternativas-a></med-alternativas-a>`,
    });
    expect(page.root).toEqualHtml(`
      <med-alternativas-a>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-alternativas-a>
    `);
  });
});
