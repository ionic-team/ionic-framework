import { newE2EPage } from '@stencil/core/testing';

describe('med-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-avatar></med-avatar>');

    const element = await page.find('med-avatar');
    expect(element).toHaveClass('hydrated');
  });
});
