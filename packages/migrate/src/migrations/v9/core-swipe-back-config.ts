import type { Migration } from '../../types.js';
import { scanLines, SOURCE_GLOBS } from '../../ast/text-scan.js';

/**
 * In React and Vue the `swipeBackEnabled` config is read once, when the outlet
 * mounts. Toggling it at runtime no longer does anything; use the
 * `swipeGesture` property on `ion-router-outlet` instead.
 *
 * Reported for every usage: telling the dynamic ones apart means proving the
 * value never changes after mount, which a source scan cannot do.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#swipebackenabled-config-behavior-change
 */
const SWIPE_BACK = /\bswipeBackEnabled\b/;

export const coreSwipeBackConfig: Migration = {
  id: 'core-swipe-back-config',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#swipebackenabled-config-behavior-change',

  detect(ctx) {
    return scanLines(ctx, SOURCE_GLOBS, (line) =>
      SWIPE_BACK.test(line)
        ? 'in React and Vue, swipeBackEnabled is read once at outlet mount now. If you toggle it at runtime, use the swipeGesture property'
        : undefined
    );
  },
};
