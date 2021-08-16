import { newE2EPage } from '@stencil/core/testing';

describe('med-vote', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-vote></med-vote>');

    const element = await page.find('med-vote');
    expect(element).toHaveClass('hydrated');
  });
});
