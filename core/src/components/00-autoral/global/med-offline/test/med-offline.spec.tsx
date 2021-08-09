import { newSpecPage } from '@stencil/core/testing';
import { MedOffline } from '../med-offline';

describe('med-offline', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedOffline],
      html: `<med-offline></med-offline>`,
    });
    expect(page.root).toEqualHtml(`
      <med-offline>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-offline>
    `);
  });
});
