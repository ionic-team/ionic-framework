/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

const engine = window.TapticEngine;
/**
 * Check to see if the Haptic Plugin is available
 * @return {boolean} Returns true or false if the plugin is available
 *
 */

/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
function hapticSelection() {
    engine && engine.selection();
}
/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
function hapticSelectionStart() {
    engine && engine.gestureSelectionStart();
}
/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
function hapticSelectionChanged() {
    engine && engine.gestureSelectionChanged();
}
/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
function hapticSelectionEnd() {
    engine && engine.gestureSelectionEnd();
}
/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */

export { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart, hapticSelection };
