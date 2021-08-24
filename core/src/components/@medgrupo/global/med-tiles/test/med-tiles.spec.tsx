import { newSpecPage } from '@stencil/core/testing';
import { MedTiles } from '../med-tiles';

describe('med-tiles', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedTiles],
      html: `<med-tiles></med-tiles>`,
    });
    expect(page.root).toEqualHtml(`
      <med-tiles>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-tiles>
    `);
  });
});
