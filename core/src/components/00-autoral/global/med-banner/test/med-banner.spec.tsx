import { newSpecPage } from '@stencil/core/testing';
import { MedBanner } from '../med-banner';

describe('med-banner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedBanner],
      html: `<med-banner></med-banner>`,
    });
    expect(page.root).toEqualHtml(`
      <med-banner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-banner>
    `);
  });
});
