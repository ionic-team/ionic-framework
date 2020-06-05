// Main types for this API
interface HapticImpactOptions {
  style: 'light' | 'medium' | 'heavy';
}

interface HapticNotificationOptions {
  style: 'success' | 'warning' | 'error';
}

const HapticEngine = {
  getEngine() {
    const win = (window as any);
    return (win.TapticEngine) || (win.Capacitor && win.Capacitor.isPluginAvailable('Haptics') && win.Capacitor.Plugins.Haptics);
  },
  available() {
    return !!this.getEngine();
  },
  isCordova() {
    return !!(window as any).TapticEngine;
  },
  isCapacitor() {
    const win = (window as any);
    return !!win.Capacitor;
  },
  impact(options: HapticImpactOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    const style = this.isCapacitor() ? options.style.toUpperCase() : options.style;
    engine.impact({ style });
  },
  notification(options: HapticNotificationOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    const style = this.isCapacitor() ? options.style.toUpperCase() : options.style;
    engine.notification({ style });
  },
  selection() {
    this.impact({ style: 'light' });
  },
  selectionStart() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    if (this.isCapacitor()) {
      engine.selectionStart();
    } else {
      engine.gestureSelectionStart();
    }
  },
  selectionChanged() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    if (this.isCapacitor()) {
      engine.selectionChanged();
    } else {
      engine.gestureSelectionChanged();
    }
  },
  selectionEnd() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    if (this.isCapacitor()) {
      engine.selectionEnd();
    } else {
      engine.gestureSelectionEnd();
    }
  }
};

/**
 * Check to see if the Haptic Plugin is available
 * @return Returns `true` or false if the plugin is available
 */
export const hapticAvailable = (): boolean => {
  return HapticEngine.available();
};

/**
 * Trigger a selection changed haptic event. Good for one-time events
 * (not for gestures)
 */
export const hapticSelection = () => {
  HapticEngine.selection();
};

/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
export const hapticSelectionStart = () => {
  HapticEngine.selectionStart();
};

/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
export const hapticSelectionChanged = () => {
  HapticEngine.selectionChanged();
};

/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
export const hapticSelectionEnd = () => {
  HapticEngine.selectionEnd();
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */
export const hapticNotification = (options: HapticNotificationOptions) => {
  HapticEngine.notification(options);
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
export const hapticImpact = (options: HapticImpactOptions) => {
  HapticEngine.impact(options);
};
