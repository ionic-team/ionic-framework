import { newE2EPage } from '@stencil/core/testing';

describe('med-paragraph', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-paragraph></med-paragraph>');

    const element = await page.find('med-paragraph');
    expect(element).toHaveClass('hydrated');
  });
});
