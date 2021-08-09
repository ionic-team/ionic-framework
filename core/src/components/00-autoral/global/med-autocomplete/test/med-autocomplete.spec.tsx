import { newSpecPage } from '@stencil/core/testing';
import { MedAutocomplete } from '../med-autocomplete';

describe('med-autocomplete', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAutocomplete],
      html: `<med-autocomplete></med-autocomplete>`,
    });
    expect(page.root).toEqualHtml(`
      <med-autocomplete>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-autocomplete>
    `);
  });
});
