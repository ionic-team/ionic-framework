import { newSpecPage } from '@stencil/core/testing';
import { MedChartDonut } from '../med-chart-donut';

describe('med-chart-donut', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedChartDonut],
      html: `<med-chart-donut></med-chart-donut>`,
    });
    expect(page.root).toEqualHtml(`
      <med-chart-donut>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-chart-donut>
    `);
  });
});
