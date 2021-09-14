import { newE2EPage } from '@stencil/core/testing';

describe('med-heading', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-heading></med-heading>');

    const element = await page.find('med-heading');
    expect(element).toHaveClass('hydrated');
  });
});
