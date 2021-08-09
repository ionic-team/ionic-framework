import { newE2EPage } from '@stencil/core/testing';

describe('med-question', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-question></med-question>');

    const element = await page.find('med-question');
    expect(element).toHaveClass('hydrated');
  });
});
