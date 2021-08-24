import { newSpecPage } from '@stencil/core/testing';
import { MedQuestion } from '../med-question';

describe('med-question', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedQuestion],
      html: `<med-question></med-question>`,
    });
    expect(page.root).toEqualHtml(`
      <med-question>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-question>
    `);
  });
});
