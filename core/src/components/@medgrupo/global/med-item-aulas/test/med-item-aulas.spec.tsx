import { newSpecPage } from '@stencil/core/testing';
import { MedItemAulas } from '../med-item-aulas';

describe('med-item-aulas', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedItemAulas],
      html: `<med-item-aulas></med-item-aulas>`,
    });
    expect(page.root).toEqualHtml(`
      <med-item-aulas>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-item-aulas>
    `);
  });
});
