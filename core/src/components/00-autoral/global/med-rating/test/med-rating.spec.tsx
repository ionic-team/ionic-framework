import { newSpecPage } from '@stencil/core/testing';
import { MedRating } from '../med-rating';

describe('med-rating', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedRating],
      html: `<med-rating></med-rating>`,
    });
    expect(page.root).toEqualHtml(`
      <med-rating>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-rating>
    `);
  });
});
