import { newSpecPage } from '@stencil/core/testing';
import { MedFontZoom } from '../med-font-zoom';

describe('med-font-zoom', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedFontZoom],
      html: `<med-font-zoom></med-font-zoom>`,
    });
    expect(page.root).toEqualHtml(`
      <med-font-zoom>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-font-zoom>
    `);
  });
});
