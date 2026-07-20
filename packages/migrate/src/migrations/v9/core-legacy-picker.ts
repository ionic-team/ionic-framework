import type { Migration } from '../../types.js';
import { scanLines, SOURCE_GLOBS } from '../../ast/text-scan.js';

/**
 * `ion-picker-legacy`/`IonPickerLegacy` and the `pickerController` /
 * `useIonPicker` controller APIs were removed in Ionic 9. Report-only: the
 * inline `ion-picker` replacement has a different API, so the rewrite needs
 * developer judgement.
 *
 * See https://ionicframework.com/docs/updating/9-0#legacy-picker
 */
export const coreLegacyPicker: Migration = {
  id: 'core-legacy-picker',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#legacy-picker',

  detect(ctx) {
    return scanLines(ctx, SOURCE_GLOBS, (line) => {
      if (/ion-picker-legacy|IonPickerLegacy/.test(line)) {
        return 'replace legacy picker with ion-picker (inline)';
      }
      if (/\bpickerController\b|\buseIonPicker\b/.test(line)) {
        return 'remove pickerController/useIonPicker; use the inline ion-picker';
      }
      // The legacy picker's type exports were removed alongside the component.
      // (PickerColumn/PickerColumnOption are intentionally excluded: they are
      // also valid v9 component names, so matching them bare would be noisy.)
      if (/\b(PickerOptions|PickerButton)\b/.test(line)) {
        return 'legacy picker type removed; use the inline ion-picker component API';
      }
      return undefined;
    });
  },
};
