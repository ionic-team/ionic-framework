import { newSpecPage } from '@stencil/core/testing';
import { MedHeading } from '../med-heading';

describe('med-heading', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedHeading],
      html: `<med-heading></med-heading>`,
    });
    expect(page.root).toEqualHtml(`
      <med-heading>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-heading>
    `);
  });
});
