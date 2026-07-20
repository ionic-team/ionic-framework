import type { Migration } from '../../types.js';
import { scanLines, SOURCE_GLOBS } from '../../ast/text-scan.js';

/**
 * `ion-img` is deprecated in Ionic 9 (removed in 10) in favor of a native
 * `<img loading="lazy" decoding="async">`. Report-only: event handlers
 * (`ionImgDidLoad` etc.) and `::part(image)` styling need per-usage rework.
 *
 * See https://ionicframework.com/docs/updating/9-0#img
 */
export const coreIonImg: Migration = {
  id: 'core-ion-img',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#img',

  detect(ctx) {
    return scanLines(ctx, SOURCE_GLOBS, (line) =>
      /<ion-img\b|\bIonImg\b/.test(line)
        ? 'ion-img is deprecated; replace with a native <img loading="lazy" decoding="async">'
        : undefined
    );
  },
};
