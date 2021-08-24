import { newSpecPage } from '@stencil/core/testing';
import { MedChartRadialLabel } from '../med-chart-radial-label';

describe('med-chart-radial-label', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedChartRadialLabel],
      html: `<med-chart-radial-label></med-chart-radial-label>`,
    });
    expect(page.root).toEqualHtml(`
      <med-chart-radial-label>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-chart-radial-label>
    `);
  });
});
