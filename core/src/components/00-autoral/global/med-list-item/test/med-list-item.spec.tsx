import { newSpecPage } from '@stencil/core/testing';
import { MedListItem } from '../med-list-item';

describe('med-list-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedListItem],
      html: `<med-list-item></med-list-item>`,
    });
    expect(page.root).toEqualHtml(`
      <med-list-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-list-item>
    `);
  });
});
