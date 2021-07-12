import { newSpecPage } from '@stencil/core/testing';
import { ChartDonut } from '../chart-donut';

describe('chart-donut', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChartDonut],
      html: `<chart-donut></chart-donut>`,
    });
    expect(page.root).toEqualHtml(`
      <chart-donut>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </chart-donut>
    `);
  });
});
