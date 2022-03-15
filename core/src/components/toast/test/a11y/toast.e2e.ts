import { newE2EPage } from '@stencil/core/testing';
import { AxePuppeteer } from '@axe-core/puppeteer';

describe('toast accessibility tests', () => {
  test('it should not have any axe violations with polite toasts', async () => {
    const page = await newE2EPage({
      url: '/src/components/toast/test/a11y?ionic:_testing=true'
    });

    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

    await page.click('#polite');

    await ionToastDidPresent.next();

    /**
     * IonToast overlays the entire screen, so
     * Axe will be unable to verify color contrast
     * on elements under the toast.
     */
    const results = await new AxePuppeteer(page)
      .disableRules('color-contrast')
      .analyze();
    expect(results.violations.length).toEqual(0);
  });

  test('it should not have any axe violations with assertive toasts', async () => {
    const page = await newE2EPage({
      url: '/src/components/toast/test/a11y?ionic:_testing=true'
    });

    const ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');

    await page.click('#assertive');

    await ionToastDidPresent.next();

    /**
     * IonToast overlays the entire screen, so
     * Axe will be unable to verify color contrast
     * on elements under the toast.
     */
    const results = await new AxePuppeteer(page)
      .disableRules('color-contrast')
      .analyze();
    expect(results.violations.length).toEqual(0);
  });
});
