import { newSpecPage } from '@stencil/core/testing';
import { Toast } from '../toast';
import { config } from '../../../global/config';

describe('toast: duration config', () => {
  it('should have duration set to 0', async () => {
    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');

    expect(toast.duration).toBe(0);
  });

  it('should have duration set to 5000', async () => {
    config.reset({ toastDuration: 5000 });

    const page = await newSpecPage({
      components: [Toast],
      html: `<ion-toast></ion-toast>`,
    });

    const toast = page.body.querySelector('ion-toast');

    expect(toast.duration).toBe(5000);
  });
});
