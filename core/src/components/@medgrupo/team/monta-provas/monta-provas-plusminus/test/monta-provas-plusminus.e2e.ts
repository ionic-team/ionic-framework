import { newE2EPage } from '@stencil/core/testing';

describe('monta-provas-plusminus', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<monta-provas-plusminus></monta-provas-plusminus>');

    const element = await page.find('monta-provas-plusminus');
    expect(element).toHaveClass('hydrated');
  });
});
