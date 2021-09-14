import { newSpecPage } from '@stencil/core/testing';
import { MedSubtitle } from '../med-subtitle';

describe('med-subtitle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedSubtitle],
      html: `<med-subtitle></med-subtitle>`,
    });
    expect(page.root).toEqualHtml(`
      <med-subtitle>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-subtitle>
    `);
  });
});
