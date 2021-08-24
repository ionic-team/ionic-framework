import { newE2EPage } from '@stencil/core/testing';

describe('med-item-aulas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-item-aulas></med-item-aulas>');

    const element = await page.find('med-item-aulas');
    expect(element).toHaveClass('hydrated');
  });
});
