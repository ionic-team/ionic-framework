import { newSpecPage } from '@stencil/core/testing';
import { MedOption } from '../med-option';

describe('med-option', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedOption],
      html: `<med-option></med-option>`,
    });
    expect(page.root).toEqualHtml(`
      <med-option>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-option>
    `);
  });
});
