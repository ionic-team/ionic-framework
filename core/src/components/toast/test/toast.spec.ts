import { newSpecPage } from '@stencil/core/testing';
import { Toast } from '../toast';
import { config } from '../../../global/config';

describe('alert: custom html', () => {
  it('should allow for custom html by default', async () => {
    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast message="<button class='custom-html'>Custom Text</button>"></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');
    const content = toast.shadowRoot.querySelector('.toast-message');
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).not.toBe(null);
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
