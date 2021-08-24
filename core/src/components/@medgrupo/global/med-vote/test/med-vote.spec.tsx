import { newSpecPage } from '@stencil/core/testing';
import { MedVote } from '../med-vote';

describe('med-vote', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedVote],
      html: `<med-vote></med-vote>`,
    });
    expect(page.root).toEqualHtml(`
      <med-vote>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-vote>
    `);
  });
});
