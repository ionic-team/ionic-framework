const _engine = (window as any).TapticEngine;

/**
 * Check to see if the Haptic Plugin is available
 * @return {boolean} Returns true or false if the plugin is available
 *
 */
export function hapticAvailable() {
  return !!_engine;
}

/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
export function hapticSelection() {
  _engine && _engine.selection();
}

/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
export function hapticSelectionStart() {
  _engine && _engine.gestureSelectionStart();
}

/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
export function hapticSelectionChanged() {
  _engine && _engine.gestureSelectionChanged();
}

/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
export function hapticSelectionEnd() {
  _engine && _engine.gestureSelectionEnd();
}

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */
export function hapticNotification(options: { type: string }) {
  _engine && _engine.notification(options);
}

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
export function hapticImpact(options: { style: string }) {
  _engine && _engine.impact(options);
}
