import { newSpecPage } from '@stencil/core/testing';
import { Child } from '../child';

describe('med-child', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Child],
      html: `<med-child></med-child>`,
    });
    expect(page.root).toEqualHtml(`
      <med-child>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-child>
    `);
  });
});
