import { newSpecPage } from '@stencil/core/testing';
import { MedRateLike } from '../med-rate-like';

describe('med-rate-like', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedRateLike],
      html: `<med-rate-like></med-rate-like>`,
    });
    expect(page.root).toEqualHtml(`
      <med-rate-like>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-rate-like>
    `);
  });
});
