import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { InfiniteScrollContent } from '../infinite-scroll-content';

describe('infinite-scroll-content: custom html', () => {
  it('should not allow for custom html by default', async () => {
    const page = await newSpecPage({
      components: [
        InfiniteScrollContent,
      ],
      html: `<ion-infinite-scroll-content loading-text="<button class='custom-html'>Custom Text</button>"></ion-infinite-scroll-content>`,
    });

    const content =
      page.body.querySelector(
        '.infinite-loading-text'
      )!;
    expect(
      content.textContent
    ).toContain('Custom Text');
    expect(
      content.querySelector(
        'button.custom-html'
      )
    ).toBe(null);
  });

  it('should allow for custom html', async () => {
    config.reset({
      innerHTMLTemplatesEnabled: true,
    });
    const page = await newSpecPage({
      components: [
        InfiniteScrollContent,
      ],
      html: `<ion-infinite-scroll-content loading-text="<button class='custom-html'>Custom Text</button>"></ion-infinite-scroll-content>`,
    });

    const content =
      page.body.querySelector(
        '.infinite-loading-text'
      )!;
    expect(
      content.textContent
    ).toContain('Custom Text');
    expect(
      content.querySelector(
        'button.custom-html'
      )
    ).not.toBe(null);
  });

  it('should not allow for custom html', async () => {
    config.reset({
      innerHTMLTemplatesEnabled: false,
    });
    const page = await newSpecPage({
      components: [
        InfiniteScrollContent,
      ],
      html: `<ion-infinite-scroll-content loading-text="<button class='custom-html'>Custom Text2</button>"></ion-infinite-scroll-content>`,
    });

    const content =
      page.body.querySelector(
        '.infinite-loading-text'
      )!;
    expect(
      content.textContent
    ).toContain('Custom Text');
    expect(
      content.querySelector(
        'button.custom-html'
      )
    ).toBe(null);
  });
});
