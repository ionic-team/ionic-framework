import { isPlainSemverRange, parseMajor } from '../../detect.js';
import { findDependency, readPackageJson } from '../../ast/package-json.js';
import type { Migration } from '../../types.js';

/**
 * Ionic 9 supports Capacitor 7 and later, and its `isCapacitorNative` relies
 * solely on `Capacitor.isNativePlatform()`, added in Capacitor 3. Report-only:
 * the fix is a Capacitor upgrade, which touches the native projects too.
 *
 * Below 3 the app stops being detected as native at all, which is the sharper of
 * the two cases.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#capacitor
 */
/** The oldest Capacitor Ionic 9 supports. */
const MIN_CAPACITOR = 7;
/** The first Capacitor with `isNativePlatform()`. */
const NATIVE_DETECTION_CAPACITOR = 3;
const CAPACITOR_CORE = '@capacitor/core';

export const coreCapacitor: Migration = {
  id: 'core-capacitor',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#capacitor',

  detect(ctx) {
    const parsed = readPackageJson(ctx);
    if (!parsed) return [];

    const dep = findDependency(parsed.pkg, CAPACITOR_CORE);
    // A protocol/alias range carries no comparable version to check.
    if (!dep || !isPlainSemverRange(dep.range)) return [];

    const major = parseMajor(dep.range);
    if (major === undefined || major >= MIN_CAPACITOR) return [];

    const detail =
      major < NATIVE_DETECTION_CAPACITOR
        ? `Capacitor ${major} is no longer detected as a native platform. ` +
          `isPlatform('capacitor'), isPlatform('hybrid'), and getPlatforms() will report web. Upgrade to Capacitor ${MIN_CAPACITOR} or later`
        : `Capacitor ${major} is not supported by Ionic 9. Upgrade to Capacitor ${MIN_CAPACITOR} or later`;

    return [{ filePath: 'package.json', line: 1, detail }];
  },
};
