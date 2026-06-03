import { NgZone } from '@angular/core';

/**
 * Asserts that the caller is running inside the Angular zone, but ONLY when the
 * app is using Zone.js. Ionic 9 defaults to zoneless change detection, where
 * there is no Angular zone to assert (and `NgZone.assertInAngularZone()` would
 * throw). The version test apps split by Angular version: ng18-20 run with
 * Zone.js and still verify the in-zone contract here, while ng21 runs zoneless
 * and skips the assertion.
 */
export function assertZoneContext(): void {
  if (typeof (window as any).Zone !== 'undefined') {
    NgZone.assertInAngularZone();
  }
}
