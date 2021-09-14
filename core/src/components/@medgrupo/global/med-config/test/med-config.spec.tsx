import { newSpecPage } from '@stencil/core/testing';
import { MedImageZoom } from '../med-config';

describe('med-config', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedConfig],
      html: `<med-config></med-config>`,
    });
    expect(page.root).toEqualHtml(`
      <med-config>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-config>
    `);
  });
});
