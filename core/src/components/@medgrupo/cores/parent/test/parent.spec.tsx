import { newSpecPage } from '@stencil/core/testing';
import { Parent } from '../parent';

describe('tst-parent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Parent],
      html: `<tst-parent></tst-parent>`,
    });
    expect(page.root).toEqualHtml(`
      <tst-parent>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </tst-parent>
    `);
  });
});
