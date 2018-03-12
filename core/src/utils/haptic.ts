const engine = (window as any).TapticEngine;

/**
 * Check to see if the Haptic Plugin is available
 * @return {boolean} Returns true or false if the plugin is available
 *
 */
export function hapticAvailable() {
  return !!engine;
}

/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
export function hapticSelection() {
  engine && engine.selection();
}

/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
export function hapticSelectionStart() {
  engine && engine.gestureSelectionStart();
}

/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
export function hapticSelectionChanged() {
  engine && engine.gestureSelectionChanged();
}

/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
export function hapticSelectionEnd() {
  engine && engine.gestureSelectionEnd();
}

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */
export function hapticNotification(options: { type: string }) {
  engine && engine.notification(options);
}

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
export function hapticImpact(options: { style: string }) {
  engine && engine.impact(options);
}
