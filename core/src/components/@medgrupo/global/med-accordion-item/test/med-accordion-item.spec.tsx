import { newSpecPage } from '@stencil/core/testing';
import { MedAccordionItem } from '../med-accordion-item';

describe('med-accordion-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAccordionItem],
      html: `<med-accordion-item></med-accordion-item>`,
    });
    expect(page.root).toEqualHtml(`
      <med-accordion-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-accordion-item>
    `);
  });
});
