import { newSpecPage } from '@stencil/core/testing';
import { MedEnunciado-discursiva } from '../med-enunciado-discursiva';

describe('med-enunciado-discursiva', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedEnunciado-discursiva],
      html: `<med-enunciado-discursiva></med-enunciado-discursiva>`,
    });
    expect(page.root).toEqualHtml(`
      <med-enunciado-discursiva>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-enunciado-discursiva>
    `);
  });
});
