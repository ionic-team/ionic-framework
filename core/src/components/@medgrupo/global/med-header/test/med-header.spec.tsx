import { newSpecPage } from '@stencil/core/testing';
import { MedHeader } from '../med-header';

describe('med-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedHeader],
      html: `<med-header></med-header>`,
    });
    expect(page.root).toEqualHtml(`
      <med-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-header>
    `);
  });
});
