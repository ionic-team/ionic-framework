import { newSpecPage } from '@stencil/core/testing';
import { MedListItemAccordion } from '../med-list-item-accordion';

describe('med-list-item-accordion', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedListItemAccordion],
      html: `<med-list-item-accordion></med-list-item-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <med-list-item-accordion>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-list-item-accordion>
    `);
  });
});
