import { isPlainSemverRange, parseMajor } from '../../detect.js';
import { findDependency, readPackageJson } from '../../ast/package-json.js';
import type { Finding, Migration } from '../../types.js';
import { V9_DOCS } from './docs.js';

/**
 * Report-only checks on the Angular toolchain around an Ionic 9 upgrade. Neither
 * is ours to rewrite: `ng update` owns the Angular version, and
 * `@ionic/angular-toolkit` versions on its own release line, so there is no
 * major this tool could safely write for it.
 *
 * See https://ionicframework.com/docs/updating/9-0#angular
 */
/** The oldest Angular Ionic 9 supports. 16 and 17 were dropped. */
const MIN_ANGULAR = 18;
/** The first Angular whose components default to `OnPush`. */
const ONPUSH_ANGULAR = 22;
const ANGULAR_CORE = '@angular/core';
const TOOLKIT = '@ionic/angular-toolkit';

export const angularVersion: Migration = {
  id: 'angular-version',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#angular',

  detect(ctx) {
    const parsed = readPackageJson(ctx);
    if (!parsed) return [];

    const findings: Finding[] = [];
    const at = (detail: string, docsUrl: string): Finding => ({
      filePath: 'package.json',
      line: 1,
      detail,
      docsUrl,
    });

    const angular = findDependency(parsed.pkg, ANGULAR_CORE);
    // A protocol/alias range carries no comparable version to check.
    if (angular && isPlainSemverRange(angular.range)) {
      const major = parseMajor(angular.range);
      if (major !== undefined && major < MIN_ANGULAR) {
        findings.push(
          at(
            `Angular ${major} is not supported by Ionic 9. Update to Angular ${MIN_ANGULAR} or later with \`ng update\``,
            `${V9_DOCS}#angular`
          )
        );
      }
      if (major !== undefined && major >= ONPUSH_ANGULAR) {
        findings.push(
          at(
            `Angular ${major} defaults components to OnPush. State set as a plain field in an Ionic lifecycle hook no longer re-renders`,
            `${V9_DOCS}#onpush-change-detection-on-angular-22`
          )
        );
        findings.push(
          at(
            `Angular ${major} raises the minimum Node.js version. Check your CI and local runtime`,
            `${V9_DOCS}#nodejs`
          )
        );
      }
    }

    if (findDependency(parsed.pkg, TOOLKIT)) {
      findings.push(
        at(`update ${TOOLKIT} to its latest release. It versions separately from @ionic/angular`, `${V9_DOCS}#angular`)
      );
    }

    return findings;
  },
};
