import { newE2EPage } from '@stencil/core/testing';

describe('med-image-zoom', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-image-zoom></med-image-zoom>');

    const element = await page.find('med-image-zoom');
    expect(element).toHaveClass('hydrated');
  });
});
