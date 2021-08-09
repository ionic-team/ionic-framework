import { newSpecPage } from '@stencil/core/testing';
import { MedToolbar } from '../med-toolbar';

describe('med-toolbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedToolbar],
      html: `<med-toolbar></med-toolbar>`,
    });
    expect(page.root).toEqualHtml(`
      <med-toolbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-toolbar>
    `);
  });
});
