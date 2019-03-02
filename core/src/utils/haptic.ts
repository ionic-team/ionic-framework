/**
 * Check to see if the Haptic Plugin is available
 * @return Returns `true` or false if the plugin is available
 */
export const hapticAvailable = (win: any): boolean => {
  const engine = win.TapticEngine;
  return !!engine;
};

/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
export const hapticSelection = (win: any) => {
  const engine = win.TapticEngine;
  if (engine) {
    engine.selection();
  }
};

/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
export const hapticSelectionStart = (win: any) => {
  const engine = win.TapticEngine;
  if (engine) {
    engine.gestureSelectionStart();
  }
};

/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
export const hapticSelectionChanged = (win: any) => {
  const engine = win.TapticEngine;
  if (engine) {
    engine.gestureSelectionChanged();
  }
};

/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
export const hapticSelectionEnd = (win: any) => {
  const engine = win.TapticEngine;
  if (engine) {
    engine.gestureSelectionEnd();
  }
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */
export const hapticNotification = (win: any, options: { type: 'success' | 'warning' | 'error' }) => {
  const engine = win.TapticEngine;
  if (engine) {
    engine.notification(options);
  }
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
export const hapticImpact = (win: any, options: { style: 'light' | 'medium' | 'heavy' }) => {
  const engine = win.TapticEngine;
  if (engine) {
    engine.impact(options);
  }
};
