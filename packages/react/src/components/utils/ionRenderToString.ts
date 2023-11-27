import type { SerializeDocumentOptions } from '@ionic/core/hydrate';
import { renderToString } from '@ionic/core/hydrate';

export async function ionRenderToString(html: string, userAgent: string, options: SerializeDocumentOptions = {}) {
  const renderToStringOptions = Object.assign(
    {},
    {
      clientHydrateAnnotations: false,
      excludeComponents: [
        // overlays
        'ion-action-sheet',
        'ion-alert',
        'ion-loading',
        'ion-modal',
        'ion-picker',
        'ion-popover',
        'ion-toast',

        // navigation
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',

        // tabs
        'ion-tabs',
        'ion-tab',

        // auxiliary
        'ion-picker-legacy-column',
      ],
      userAgent,
    },
    options
  );

  const ionHtml = await renderToString(html, renderToStringOptions);
  return ionHtml.html;
}
