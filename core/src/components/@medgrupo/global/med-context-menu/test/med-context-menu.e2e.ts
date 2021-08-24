import { newE2EPage } from '@stencil/core/testing';

describe('med-context-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-context-menu></med-context-menu>');

    const element = await page.find('med-context-menu');
    expect(element).toHaveClass('hydrated');
  });
});
