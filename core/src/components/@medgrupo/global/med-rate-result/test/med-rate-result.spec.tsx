import { newSpecPage } from '@stencil/core/testing';
import { MedRateResult } from '../med-rate-result';

describe('med-rate-result', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedRateResult],
      html: `<med-rate-result></med-rate-result>`,
    });
    expect(page.root).toEqualHtml(`
      <med-rate-result>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-rate-result>
    `);
  });
});
