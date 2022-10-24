// Main types for this API
interface HapticImpactOptions {
  style: 'light' | 'medium' | 'heavy';
}

interface HapticNotificationOptions {
  style: 'success' | 'warning' | 'error';
}

const HapticEngine = {
  getEngine() {
    const win = window as any;
    return win.TapticEngine || (win.Capacitor?.isPluginAvailable('Haptics') && win.Capacitor.Plugins.Haptics);
  },
  available() {
    const win = window as any;
    const engine = this.getEngine();
    if (!engine) {
      return false;
    }

    /**
     * Developers can manually import the
     * Haptics plugin in their app which will cause
     * getEngine to return the Haptics engine. However,
     * the Haptics engine will throw an error if
     * used in a web browser that does not support
     * the Vibrate API. This check avoids that error
     * if the browser does not support the Vibrate API.
     */
    if (win.Capacitor?.getPlatform() === 'web') {
      return typeof navigator !== 'undefined' && navigator.vibrate !== undefined;
    }

    return true;
  },
  isCordova() {
    return !!(window as any).TapticEngine;
  },
  isCapacitor() {
    const win = window as any;
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
  },
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
  hapticAvailable() && HapticEngine.selection();
};

/**
 * Tell the haptic engine that a gesture for a selection change is starting.
 */
export const hapticSelectionStart = () => {
  hapticAvailable() && HapticEngine.selectionStart();
};

/**
 * Tell the haptic engine that a selection changed during a gesture.
 */
export const hapticSelectionChanged = () => {
  hapticAvailable() && HapticEngine.selectionChanged();
};

/**
 * Tell the haptic engine we are done with a gesture. This needs to be
 * called lest resources are not properly recycled.
 */
export const hapticSelectionEnd = () => {
  hapticAvailable() && HapticEngine.selectionEnd();
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
 */
export const hapticNotification = (options: HapticNotificationOptions) => {
  hapticAvailable() && HapticEngine.notification(options);
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
 */
export const hapticImpact = (options: HapticImpactOptions) => {
  hapticAvailable() && HapticEngine.impact(options);
};
