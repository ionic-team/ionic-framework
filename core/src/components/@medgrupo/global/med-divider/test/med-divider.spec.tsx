import { newSpecPage } from '@stencil/core/testing';
import { MedDivider } from '../med-divider';

describe('med-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedDivider],
      html: `<med-divider></med-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <med-divider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-divider>
    `);
  });
});
