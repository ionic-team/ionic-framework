import type {
  HapticsPlugin,
  NotificationType as CapacitorNotificationType,
  ImpactStyle as CapacitorImpactStyle,
} from '@capacitor/haptics';

import { getCapacitor } from './capacitor';

export enum ImpactStyle {
  /**
   * A collision between large, heavy user interface elements
   *
   * @since 1.0.0
   */
  Heavy = 'HEAVY',
  /**
   * A collision between moderately sized user interface elements
   *
   * @since 1.0.0
   */
  Medium = 'MEDIUM',
  /**
   * A collision between small, light user interface elements
   *
   * @since 1.0.0
   */
  Light = 'LIGHT',
}

interface HapticImpactOptions {
  style: CapacitorImpactStyle;
}

export enum NotificationType {
  /**
   * A notification feedback type indicating that a task has completed successfully
   *
   * @since 1.0.0
   */
  Success = 'SUCCESS',
  /**
   * A notification feedback type indicating that a task has produced a warning
   *
   * @since 1.0.0
   */
  Warning = 'WARNING',
  /**
   * A notification feedback type indicating that a task has failed
   *
   * @since 1.0.0
   */
  Error = 'ERROR',
}

interface HapticNotificationOptions {
  type: CapacitorNotificationType;
}

const HapticEngine = {
  getEngine(): HapticsPlugin | undefined {
    const capacitor = getCapacitor();

    if (capacitor?.isPluginAvailable('Haptics')) {
      // Capacitor
      return capacitor.Plugins.Haptics as HapticsPlugin;
    }
    return undefined;
  },
  available() {
    const engine = this.getEngine();
    if (!engine) {
      return false;
    }

    const capacitor = getCapacitor();

    /**
     * Developers can manually import the
     * Haptics plugin in their app which will cause
     * getEngine to return the Haptics engine. However,
     * the Haptics engine will throw an error if
     * used in a web browser that does not support
     * the Vibrate API. This check avoids that error
     * if the browser does not support the Vibrate API.
     */
    if (capacitor?.getPlatform() === 'web') {
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      return typeof navigator !== 'undefined' && navigator.vibrate !== undefined;
    }

    return true;
  },
  impact(options: HapticImpactOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.impact({ style: options.style });
  },
  notification(options: HapticNotificationOptions) {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.notification({ type: options.type });
  },
  selection() {
    this.impact({ style: ImpactStyle.Light });
  },
  selectionStart() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.selectionStart();
  },
  selectionChanged() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.selectionChanged();
  },
  selectionEnd() {
    const engine = this.getEngine();
    if (!engine) {
      return;
    }
    engine.selectionEnd();
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
 * options should be of the type `{ type: NotificationType.SUCCESS }` (or `WARNING`/`ERROR`)
 */
export const hapticNotification = (options: HapticNotificationOptions) => {
  hapticAvailable() && HapticEngine.notification(options);
};

/**
 * Use this to indicate success/failure/warning to the user.
 * options should be of the type `{ style: ImpactStyle.LIGHT }` (or `MEDIUM`/`HEAVY`)
 */
export const hapticImpact = (options: HapticImpactOptions) => {
  hapticAvailable() && HapticEngine.impact(options);
};
