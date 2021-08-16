import { newSpecPage } from '@stencil/core/testing';
import { MedMessage } from '../med-message';

describe('med-message', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedMessage],
      html: `<med-message></med-message>`,
    });
    expect(page.root).toEqualHtml(`
      <med-message>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-message>
    `);
  });
});
