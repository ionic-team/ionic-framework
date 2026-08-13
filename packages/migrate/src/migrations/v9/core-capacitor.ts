import { isPlainSemverRange, parseMajor } from '../../detect.js';
import { findDependency, readPackageJson } from '../../ast/package-json.js';
import type { Migration } from '../../types.js';

/**
 * Ionic 9's `isCapacitorNative` relies solely on `Capacitor.isNativePlatform()`,
 * added in Capacitor 3. Report-only: the fix is a Capacitor upgrade.
 *
 * See https://ionicframework.com/docs/updating/9-0#capacitor
 */
/** The first Capacitor with `isNativePlatform()`. */
const MIN_CAPACITOR = 3;
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

    return [
      {
        filePath: 'package.json',
        line: 1,
        detail:
          `Capacitor ${major} is no longer detected as a native platform. ` +
          `isPlatform('capacitor'), isPlatform('hybrid'), and getPlatforms() will report web. Upgrade to Capacitor 7 or later`,
      },
    ];
  },
};
