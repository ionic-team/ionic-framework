import { newSpecPage } from '@stencil/core/testing';
import { MedImageZoom } from '../med-image-zoom';

describe('med-image-zoom', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedImageZoom],
      html: `<med-image-zoom></med-image-zoom>`,
    });
    expect(page.root).toEqualHtml(`
      <med-image-zoom>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-image-zoom>
    `);
  });
});
