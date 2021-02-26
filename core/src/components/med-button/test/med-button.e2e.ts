import { newE2EPage } from '@stencil/core/testing';

describe('med-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-button></med-button>');

    const element = await page.find('med-button');
    expect(element).toHaveClass('hydrated');
  });
});
