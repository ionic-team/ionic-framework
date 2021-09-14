import { newSpecPage } from '@stencil/core/testing';
import { MedCaption } from '../med-caption';

describe('med-caption', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedCaption],
      html: `<med-caption></med-caption>`,
    });
    expect(page.root).toEqualHtml(`
      <med-caption>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-caption>
    `);
  });
});
