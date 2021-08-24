import { newE2EPage } from '@stencil/core/testing';

describe('med-message-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-message-list></med-message-list>');

    const element = await page.find('med-message-list');
    expect(element).toHaveClass('hydrated');
  });
});
