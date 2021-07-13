import { newSpecPage } from '@stencil/core/testing';
import { MedChartLabel } from '../med-chart-label';

describe('med-chart-label', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedChartLabel],
      html: `<med-chart-label></med-chart-label>`,
    });
    expect(page.root).toEqualHtml(`
      <med-chart-label>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-chart-label>
    `);
  });
});
