import { newSpecPage } from '@stencil/core/testing';
import { MedList } from '../med-list';

describe('med-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedList],
      html: `<med-list></med-list>`,
    });
    expect(page.root).toEqualHtml(`
      <med-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-list>
    `);
  });
});
