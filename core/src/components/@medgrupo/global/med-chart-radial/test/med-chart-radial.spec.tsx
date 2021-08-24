import { newSpecPage } from '@stencil/core/testing';
import { MedChartRadial } from '../med-chart-radial';

describe('med-chart-radial', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedChartRadial],
      html: `<med-chart-radial></med-chart-radial>`,
    });
    expect(page.root).toEqualHtml(`
      <med-chart-radial>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-chart-radial>
    `);
  });
});
