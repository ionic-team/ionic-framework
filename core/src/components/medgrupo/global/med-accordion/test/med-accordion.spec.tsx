import { newSpecPage } from '@stencil/core/testing';
import { MedAccordion } from '../med-accordion';

describe('med-accordion', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAccordion],
      html: `<med-accordion></med-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <med-accordion>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-accordion>
    `);
  });
});
