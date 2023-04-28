import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../../modal';
import { initialize } from '../../../utils/ionic-global';
describe('modal: canDismiss', () => {
  describe('modal: regular modal', () => {
    it('should dismiss when canDismiss is true', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => <ion-modal animated={false} canDismiss={true}></ion-modal>,
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(true);
    });

    it('should not dismiss when canDismiss is false', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => <ion-modal animated={false} canDismiss={false}></ion-modal>,
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(false);
    });

    it('should dismiss when canDismiss is Promise<true>', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => (
          <ion-modal
            animated={false}
            canDismiss={() => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(true), 50);
              });
            }}
          ></ion-modal>
        ),
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(true);
    });

    it('should not dismiss when canDismiss is Promise<false>', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => (
          <ion-modal
            animated={false}
            canDismiss={() => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(false), 50);
              });
            }}
          ></ion-modal>
        ),
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(false);
    });
  });
  describe('modal: sheet modal', () => {
    it('should dismiss when canDismiss is true', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => (
          <ion-modal breakpoints={[0, 1]} initialBreakpoint={1} animated={false} canDismiss={true}></ion-modal>
        ),
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(true);
    });

    it('should not dismiss when canDismiss is false', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => (
          <ion-modal breakpoints={[0, 1]} initialBreakpoint={1} animated={false} canDismiss={false}></ion-modal>
        ),
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(false);
    });

    it('should dismiss when canDismiss is Promise<true>', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => (
          <ion-modal
            breakpoints={[0, 1]}
            initialBreakpoint={1}
            animated={false}
            canDismiss={() => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(true), 50);
              });
            }}
          ></ion-modal>
        ),
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(true);
    });

    it('should not dismiss when canDismiss is Promise<false>', async () => {
      const page = await newSpecPage({
        components: [Modal],
        template: () => (
          <ion-modal
            breakpoints={[0, 1]}
            initialBreakpoint={1}
            animated={false}
            canDismiss={() => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(false), 50);
              });
            }}
          ></ion-modal>
        ),
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss();

      await expect(returnValue).toBe(false);
    });
  });
});
