import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { dragElementBy } from '@utils/test';

describe('modal - canDismiss handler', () => {
  let page: E2EPage;

  describe('regular modal', () => {
    beforeEach(async () => {
      page = await newE2EPage({ url: '/src/components/modal/test/canDismiss?ionic:_testing=true' });
    });

    it('should dismiss when canDismiss is true', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is false', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
    it('should dismiss when canDismiss is Promise<true>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-true');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(true);
    });
    it('should not dismiss when canDismiss is Promise<false>', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#radio-promise-false');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      const modal = await page.find('ion-modal');
      const returnValue = await modal.callMethod('dismiss');

      expect(returnValue).toBe(false);
    });
    it('should dismiss when canDismiss is Action Sheet and user clicks confirm', async () => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      await page.click('#radio-action-sheet');
      await page.click('#show-modal');

      await ionModalDidPresent.next();

      await page.keyboard.press('Escape');

      await ionActionSheetDidPresent.next();
      await page.click('.button-confirm');

      await ionModalDidDismiss.next();
    });
  });
});
