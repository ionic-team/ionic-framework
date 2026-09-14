import { NgZone } from '@angular/core';

/**
 * Whether the current call stack is in the Angular zone, which during component
 * construction is also the app's change detection mode. Call it from an in-zone
 * context, since from `runOutsideAngular` it reports zoneless on a zone app.
 *
 * The `Zone` global is not a substitute, since Angular 22 bootstraps zoneless
 * even when Zone.js is loaded. The assertion below still gates on that global,
 * because using this predicate as its own gate would make it vacuous.
 */
export function isZoneChangeDetection(): boolean {
  return NgZone.isInAngularZone();
}

/**
 * Asserts that the caller is running inside the Angular zone, but ONLY when the
 * app is using Zone.js. Ionic 9 defaults to zoneless change detection, where
 * there is no Angular zone to assert (and `NgZone.assertInAngularZone()` would
 * throw). The test apps split by mode rather than by Angular version: ng18-20
 * and ng22-zone run with Zone.js and still verify the in-zone contract here,
 * while ng21 and ng22 run zoneless and skip the assertion.
 */
export function assertZoneContext(): void {
  if (typeof (window as any).Zone !== 'undefined') {
    NgZone.assertInAngularZone();
  }
}
