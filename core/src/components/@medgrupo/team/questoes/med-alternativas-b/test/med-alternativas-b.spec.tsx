import { newSpecPage } from '@stencil/core/testing';
import { MedAlternativasB } from '../med-alternativas-b';

describe('med-alternativas-b', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAlternativasB],
      html: `<med-alternativas-b></med-alternativas-b>`,
    });
    expect(page.root).toEqualHtml(`
      <med-alternativas-b>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-alternativas-b>
    `);
  });
});
