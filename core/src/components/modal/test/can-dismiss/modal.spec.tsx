import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { setMode } from '@stencil/core';

import { Modal } from '../../modal';
import { Content } from '../../../content/content';

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
  describe('modal: card modal', () => {
    beforeEach(() => {
      /**
       * Card modal is only available on iOS
       */
      setMode((elm) => 'ios');
    });
    it('should dismiss when canDismiss is true', async () => {
      const page = await newSpecPage({
        components: [Content, Modal],
        template: () => (
          <ion-modal presentingElement={document.createElement('div')} animated={false} canDismiss={true}>
            <ion-content>Test Content</ion-content>
          </ion-modal>
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
        components: [Content, Modal],
        template: () => (
          <ion-modal presentingElement={document.createElement('div')} animated={false} canDismiss={false}>
            <ion-content>Test Content</ion-content>
          </ion-modal>
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
        components: [Content, Modal],
        template: () => (
          <ion-modal
            presentingElement={document.createElement('div')}
            animated={false}
            canDismiss={() => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(true), 50);
              });
            }}
          >
            <ion-content>Test Content</ion-content>
          </ion-modal>
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
        components: [Content, Modal],
        template: () => (
          <ion-modal
            presentingElement={document.createElement('div')}
            animated={false}
            canDismiss={() => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(false), 50);
              });
            }}
          >
            <ion-content>Test Content</ion-content>
          </ion-modal>
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
  describe('modal: data and role', () => {
    test('should pass data and role when calling dismiss', async () => {
      const canDismiss = jest.fn();
      const page = await newSpecPage({
        components: [Modal],
        template: () => <ion-modal animated={false} canDismiss={canDismiss}></ion-modal>,
      });

      const modal = page.body.querySelector('ion-modal');

      await modal.present();
      await page.waitForChanges();

      const returnValue = await modal.dismiss('my data', 'my role');

      expect(canDismiss).toHaveBeenCalledWith('my data', 'my role');
    });
  });
});
