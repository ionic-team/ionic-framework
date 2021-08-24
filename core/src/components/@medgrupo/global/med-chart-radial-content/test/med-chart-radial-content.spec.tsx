import { newSpecPage } from '@stencil/core/testing';
import { MedChartRadialContent } from '../med-chart-radial-content';

describe('med-chart-radial-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedChartRadialContent],
      html: `<med-chart-radial-content></med-chart-radial-content>`,
    });
    expect(page.root).toEqualHtml(`
      <med-chart-radial-content>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-chart-radial-content>
    `);
  });
});
