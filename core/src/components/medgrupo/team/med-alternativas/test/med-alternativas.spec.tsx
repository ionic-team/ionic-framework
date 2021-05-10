import { newSpecPage } from '@stencil/core/testing';
import { MedAlternativas } from '../med-alternativas';

describe('med-alternativas', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAlternativas],
      html: `<med-alternativas></med-alternativas>`,
    });
    expect(page.root).toEqualHtml(`
      <med-alternativas>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-alternativas>
    `);
  });
});
