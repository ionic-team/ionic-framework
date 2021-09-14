import { newSpecPage } from '@stencil/core/testing';
import { MedThemes } from '../med-themes';

describe('med-temas', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedThemes],
      html: `<med-temas></med-temas>`,
    });
    expect(page.root).toEqualHtml(`
      <med-temas>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-temas>
    `);
  });
});
