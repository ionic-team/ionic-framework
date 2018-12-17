/**
 * Check to see if the Haptic Plugin is available
 * @return Returns `true` or false if the plugin is available
 */
export function hapticAvailable(): boolean {
  const engine = (window as any).TapticEngine;
  return !!engine;
}

/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
export function hapticSelection() {
  const engine = (window as any).TapticEngine;
  if (engine) {
    engine.selection();
  }
}

/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
export function hapticSelectionStart() {
  const engine = (window as any).TapticEngine;
  if (engine) {
    engine.gestureSelectionStart();
  }
}

/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
export function hapticSelectionChanged() {
  const engine = (window as any).TapticEngine;
  if (engine) {
    engine.gestureSelectionChanged();
  }
}

/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
export function hapticSelectionEnd() {
  const engine = (window as any).TapticEngine;
  if (engine) {
    engine.gestureSelectionEnd();
  }
}

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */
export function hapticNotification(options: { type: 'success' | 'warning' | 'error' }) {
  const engine = (window as any).TapticEngine;
  if (engine) {
    engine.notification(options);
  }
}

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
export function hapticImpact(options: { style: 'light' | 'medium' | 'heavy' }) {
  const engine = (window as any).TapticEngine;
  if (engine) {
    engine.impact(options);
  }
}
