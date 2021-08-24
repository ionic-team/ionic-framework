import { newSpecPage } from '@stencil/core/testing';
import { MedContextMenu } from '../med-context-menu';

describe('med-context-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedContextMenu],
      html: `<med-context-menu></med-context-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <med-context-menu>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-context-menu>
    `);
  });
});
