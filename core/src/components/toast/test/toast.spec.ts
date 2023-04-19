import { newSpecPage } from '@stencil/core/testing';
import { Toast } from '../toast';
import { config } from '../../../global/config';

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
