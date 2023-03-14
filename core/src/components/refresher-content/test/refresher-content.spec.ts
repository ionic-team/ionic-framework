import { newSpecPage } from '@stencil/core/testing';
import { RefresherContent } from '../refresher-content';
import { config } from '../../../global/config';

describe('refresher-content: custom html', () => {
  it('should allow for custom html by default', async () => {
    const page = await newSpecPage({
      components: [RefresherContent],
      html: `<ion-refresher-content pulling-text="<button class='custom-pulling-html'>Custom Pulling Text</button>" refreshing-text="<button class='custom-refreshing-html'>Custom Refreshing Text</button>"></ion-refresher-content>`,
    });

    const pullingContent = page.body.querySelector('.refresher-pulling-text');
    expect(pullingContent.textContent).toContain('Custom Pulling Text');
    expect(pullingContent.querySelector('button.custom-pulling-html')).not.toBe(null);

    const refreshingContent = page.body.querySelector('.refresher-refreshing-text');
    expect(refreshingContent.textContent).toContain('Custom Refreshing Text');
    expect(refreshingContent.querySelector('button.custom-refreshing-html')).not.toBe(null);
  });

  it('should allow for custom html', async () => {
    config.reset({ enableHTMLContent: true });
    const page = await newSpecPage({
      components: [RefresherContent],
      html: `<ion-refresher-content pulling-text="<button class='custom-pulling-html'>Custom Pulling Text</button>" refreshing-text="<button class='custom-refreshing-html'>Custom Refreshing Text</button>"></ion-refresher-content>`,
    });

    const pullingContent = page.body.querySelector('.refresher-pulling-text');
    expect(pullingContent.textContent).toContain('Custom Pulling Text');
    expect(pullingContent.querySelector('button.custom-pulling-html')).not.toBe(null);

    const refreshingContent = page.body.querySelector('.refresher-refreshing-text');
    expect(refreshingContent.textContent).toContain('Custom Refreshing Text');
    expect(refreshingContent.querySelector('button.custom-refreshing-html')).not.toBe(null);
  });

  it('should not allow for custom html', async () => {
    config.reset({ enableHTMLContent: false });
    const page = await newSpecPage({
      components: [RefresherContent],
      html: `<ion-refresher-content pulling-text="<button class='custom-pulling-html'>Custom Pulling Text</button>" refreshing-text="<button class='custom-html'>Custom Refreshing Text</button>"></ion-refresher-content>`,
    });

    const pullingContent = page.body.querySelector('.refresher-pulling-text');
    expect(pullingContent.textContent).toContain('Custom Pulling Text');
    expect(pullingContent.querySelector('button.custom-pulling-html')).toBe(null);

    const refreshingContent = page.body.querySelector('.refresher-refreshing-text');
    expect(refreshingContent.textContent).toContain('Custom Refreshing Text');
    expect(refreshingContent.querySelector('button.custom-refreshing-html')).toBe(null);
  });
});
