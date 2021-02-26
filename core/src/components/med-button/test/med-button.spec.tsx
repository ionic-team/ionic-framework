import { newSpecPage } from '@stencil/core/testing';
import { MedButton } from '../button';

describe('med-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedButton],
      html: `<med-button></med-button>`,
    });
    expect(page.root).toEqualHtml(`
      <med-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-button>
    `);
  });
});
