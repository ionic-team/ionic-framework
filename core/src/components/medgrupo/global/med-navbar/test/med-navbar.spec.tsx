import { newSpecPage } from '@stencil/core/testing';
import { MedNavbar } from '../med-navbar';

describe('med-navbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedNavbar],
      html: `<med-navbar></med-navbar>`,
    });
    expect(page.root).toEqualHtml(`
      <med-navbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-navbar>
    `);
  });
});
