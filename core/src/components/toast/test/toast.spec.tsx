import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Toast } from '../toast';
import { config } from '../../../global/config';
import { toastController } from '../../../utils/overlays';
import { createAnimation } from '@utils/animation/animation';

describe('toast: custom html', () => {
  it('should not allow for custom html by default', async () => {
    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast message="<button class='custom-html'>Custom Text</button>"></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');
    const content = toast.shadowRoot.querySelector('.toast-message');
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).toBe(null);
  });

  it('should allow for custom html', async () => {
    config.reset({ innerHTMLTemplatesEnabled: true });
    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast message="<button class='custom-html'>Custom Text</button>"></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');
    const content = toast.shadowRoot.querySelector('.toast-message');
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).not.toBe(null);
  });

  it('should not allow for custom html', async () => {
    config.reset({ innerHTMLTemplatesEnabled: false });
    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast message="<button class='custom-html'>Custom Text</button>"></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');
    const content = toast.shadowRoot.querySelector('.toast-message');
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).toBe(null);
  });
});

/**
 * These tests check if the aria-hidden attributes are being
 * removed on present. Without this functionality, screen readers
 * would not announce toast content correctly.
 */
describe('toast: a11y smoke test', () => {
  it('should have aria-hidden content when dismissed', async () => {
    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast message="Message" header="Header"></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');
    const header = toast.shadowRoot.querySelector('.toast-header');
    const message = toast.shadowRoot.querySelector('.toast-message');

    expect(header.getAttribute('aria-hidden')).toBe('true');
    expect(message.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not have aria-hidden content when presented', async () => {
    const page = await newSpecPage({
      components: [Toast],
      html: `
        <ion-app>
          <ion-toast animated="false" message="Message" header="Header"></ion-toast>
        </ion-app>
      `,
    });

    const toast = page.body.querySelector('ion-toast');

    /**
     * Wait for present method to resolve
     * and for state change to take effect.
     */
    await toast.present();
    await page.waitForChanges();

    const header = toast.shadowRoot.querySelector('.toast-header');
    const message = toast.shadowRoot.querySelector('.toast-message');

    expect(header.getAttribute('aria-hidden')).toBe(null);
    expect(message.getAttribute('aria-hidden')).toBe(null);
  });
});

describe('toast: htmlAttributes', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [Toast],
      template: () => <ion-toast htmlAttributes={{ 'data-testid': 'basic-toast' }}></ion-toast>,
    });

    const toast = page.body.querySelector('ion-toast');

    await expect(toast.getAttribute('data-testid')).toBe('basic-toast');
  });
});

describe('toast: button cancel', () => {
  it('should render the cancel button with part button-cancel', async () => {
    const page = await newSpecPage({
      components: [Toast],
      template: () => <ion-toast buttons={[{ text: 'Cancel', role: 'cancel' }]}></ion-toast>,
    });

    const toast = page.body.querySelector('ion-toast');

    const buttonCancel = toast?.shadowRoot?.querySelector('.toast-button-cancel');

    expect(buttonCancel.getAttribute('part')).toBe('button cancel');
  });
});

describe('toast: swipe gesture', () => {
  describe('prefersSwipeGesture()', () => {
    let toast: Toast;
    beforeEach(() => {
      toast = new Toast();
    });
    it('should return true if set to a valid swipe value', () => {
      toast.swipeGesture = 'vertical';
      expect(toast.prefersSwipeGesture()).toBe(true);
    });
    it('should return false if set to undefined', () => {
      toast.swipeGesture = undefined;
      expect(toast.prefersSwipeGesture()).toBe(false);
    });
    it('should return false if set to null', () => {
      toast.swipeGesture = null;
      expect(toast.prefersSwipeGesture()).toBe(false);
    });
    it('should return false if set to invalid string', () => {
      toast.swipeGesture = 'limit'; // `'limit'` doesn't exist
      expect(toast.prefersSwipeGesture()).toBe(false);
    });
  });
  describe('swipeGesture property', () => {
    let toast: Toast;
    beforeEach(() => {
      toast = new Toast();
      // Stub the enter animation so we aren't querying elements in the DOM that may not exist
      toast.enterAnimation = () => createAnimation();
    });
    it('should not create a swipe gesture on present if swipeGesture is undefined', async () => {
      expect(toast.gesture).toBe(undefined);

      await toast.present();

      expect(toast.gesture).toBe(undefined);
    });
    it('should create a swipe gesture on present', async () => {
      toast.swipeGesture = 'vertical';

      expect(toast.gesture).toBe(undefined);

      await toast.present();

      expect(toast.gesture).not.toBe(undefined);
    });
    it('should destroy a swipe gesture on dismiss', async () => {
      toast.swipeGesture = 'vertical';

      await toast.present();

      expect(toast.gesture).not.toBe(undefined);

      await toast.dismiss();

      expect(toast.gesture).toBe(undefined);
    });
    it('should create a swipe gesture if swipeGesture is set after present', async () => {
      await toast.present();
      expect(toast.gesture).toBe(undefined);

      /**
       * Manually invoke the watch
       * callback synchronously.
       */
      toast.swipeGesture = 'vertical';
      toast.swipeGestureChanged();

      expect(toast.gesture).not.toBe(undefined);
    });
    it('should destroy a swipe gesture if swipeGesture is cleared after present', async () => {
      toast.swipeGesture = 'vertical';

      await toast.present();
      expect(toast.gesture).not.toBe(undefined);

      /**
       * Manually invoke the watch
       * callback synchronously.
       */
      toast.swipeGesture = undefined;
      toast.swipeGestureChanged();

      expect(toast.gesture).toBe(undefined);
    });
    it('should not create a swipe gesture if the toast is not presented', async () => {
      expect(toast.gesture).toBe(undefined);

      toast.swipeGesture = 'vertical';
      toast.swipeGestureChanged();

      expect(toast.gesture).toBe(undefined);
    });
  });
});
