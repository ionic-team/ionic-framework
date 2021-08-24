import { newSpecPage } from '@stencil/core/testing';
import { MedAvatar } from '../med-avatar';

describe('med-avatar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedAvatar],
      html: `<med-avatar></med-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <med-avatar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-avatar>
    `);
  });
});
