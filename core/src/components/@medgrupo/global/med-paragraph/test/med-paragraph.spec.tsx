import { newSpecPage } from '@stencil/core/testing';
import { MedParagraph } from '../med-paragraph';

describe('med-paragraph', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedParagraph],
      html: `<med-paragraph></med-paragraph>`,
    });
    expect(page.root).toEqualHtml(`
      <med-paragraph>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-paragraph>
    `);
  });
});
