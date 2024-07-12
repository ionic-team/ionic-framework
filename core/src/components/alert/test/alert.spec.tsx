import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { Alert } from '../alert';
import { h } from '@stencil/core';

describe('alert: custom html', () => {
  it('should not allow for custom html by default', async () => {
    const page = await newSpecPage({
      components: [Alert],
      html: `<ion-alert message="<button class='custom-html'>Custom Text</button>"></ion-alert>`,
    });

    const content = page.body.querySelector('.alert-message')!;
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).toBe(null);
  });

  it('should allow for custom html', async () => {
    config.reset({ innerHTMLTemplatesEnabled: true });
    const page = await newSpecPage({
      components: [Alert],
      html: `<ion-alert message="<button class='custom-html'>Custom Text</button>"></ion-alert>`,
    });

    const content = page.body.querySelector('.alert-message')!;
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).not.toBe(null);
  });

  it('should not allow for custom html', async () => {
    config.reset({ innerHTMLTemplatesEnabled: false });
    const page = await newSpecPage({
      components: [Alert],
      html: `<ion-alert message="<button class='custom-html'>Custom Text</button>"></ion-alert>`,
    });

    const content = page.body.querySelector('.alert-message')!;
    expect(content.textContent).toContain('Custom Text');
    expect(content.querySelector('button.custom-html')).toBe(null);
  });

  it('should not overwrite the id set in htmlAttributes', async () => {
    const id = 'custom-id'
    const page = await newSpecPage({
      components: [Alert],
      template: () => <ion-alert htmlAttributes={{id}} overlayIndex={-1}></ion-alert>
    });

    const alert = page.body.querySelector('ion-alert')!;
    expect(alert.id).toBe(id);
  });

});
