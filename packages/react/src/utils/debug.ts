import type { LogLevel } from '@ionic/core/components';

import { getConfig } from './config';

/**
 * Spelled out instead of imported as a value so this util doesn't pull core's
 * runtime into unit tests. The template type still breaks the build on a rename.
 */
const DEBUG: `${LogLevel.DEBUG}` = 'DEBUG';

/** Whether the app opted into debug logging with `logLevel: 'DEBUG'`. */
const isDebugEnabled = (): boolean => {
  return String(getConfig()?.get('logLevel') ?? '').toUpperCase() === DEBUG;
};

/** @internal */
export type DebugLogger = (event: string, getData?: () => unknown) => void;

/**
 * Logger namespaced to a package, e.g. `react-router`. The payload is a function
 * so nothing it collects runs while logging is off.
 *
 * @internal
 */
export const createDebugLogger = (namespace: string): DebugLogger => {
  return (event, getData) => {
    if (!isDebugEnabled()) {
      return;
    }

    const prefix = `[Ionic Debug]: [${namespace}] - ${event}`;
    const data = getData?.();

    if (data === undefined) {
      console.log(prefix);
      return;
    }

    let serialized: string;
    try {
      serialized = JSON.stringify(data);
    } catch {
      // A circular reference in the payload must not break navigation.
      serialized = '[unserializable payload]';
    }

    console.log(prefix, serialized);
  };
};
