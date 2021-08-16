import { newE2EPage } from '@stencil/core/testing';

describe('med-message', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-message></med-message>');

    const element = await page.find('med-message');
    expect(element).toHaveClass('hydrated');
  });
});
