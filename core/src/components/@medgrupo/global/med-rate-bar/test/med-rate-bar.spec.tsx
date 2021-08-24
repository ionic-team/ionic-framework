import { newSpecPage } from '@stencil/core/testing';
import { MedRateBar } from '../med-rate-bar';

describe('med-rate-bar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedRateBar],
      html: `<med-rate-bar></med-rate-bar>`,
    });
    expect(page.root).toEqualHtml(`
      <med-rate-bar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-rate-bar>
    `);
  });
});
