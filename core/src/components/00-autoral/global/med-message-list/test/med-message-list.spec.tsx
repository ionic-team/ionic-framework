import { newSpecPage } from '@stencil/core/testing';
import { MedMessageList } from '../med-message-list';

describe('med-message-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MedMessageList],
      html: `<med-message-list></med-message-list>`,
    });
    expect(page.root).toEqualHtml(`
      <med-message-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </med-message-list>
    `);
  });
});
