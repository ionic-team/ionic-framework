import { newE2EPage } from '@stencil/core/testing';

describe('med-config', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<med-config></med-config>');

    const element = await page.find('med-config');
    expect(element).toHaveClass('hydrated');
  });
});
