import { newSpecPage } from '@stencil/core/testing';
import { MedTooltip } from '../med-tooltip';

describe('med-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedTooltip],
      html: `<med-tooltip></med-tooltip>`,
    });
    expect(page.root).toEqualHtml(`
      <med-tooltip>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-tooltip>
    `);
  });
});
