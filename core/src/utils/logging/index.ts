import { config } from '@global/config';

export enum LogLevel {
  OFF = 'OFF',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
}

/**
 * Ranks each level so an enabled check is a numeric comparison. A configured
 * level logs anything whose rank is less than or equal to its own: `OFF` (0)
 * logs nothing, `ERROR` (1) logs errors, `WARN` (2) logs errors and warnings,
 * `DEBUG` (3) logs all of the above plus internal diagnostics.
 */
const LOG_LEVEL_RANK: Record<LogLevel, number> = {
  [LogLevel.OFF]: 0,
  [LogLevel.ERROR]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.DEBUG]: 3,
};

/**
 * Whether the configured level is verbose enough to log `minimum`. Levels set
 * through a query parameter arrive as raw strings, hence the uppercasing.
 */
const isLogLevelEnabled = (minimum: LogLevel): boolean => {
  const configured = String(config.get('logLevel', LogLevel.WARN)).toUpperCase() as LogLevel;
  return LOG_LEVEL_RANK[configured] >= LOG_LEVEL_RANK[minimum];
};

/**
 * Logs a warning to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 */
export const printIonWarning = (message: string, ...params: any[]) => {
  if (isLogLevelEnabled(LogLevel.WARN)) {
    return console.warn(`[Ionic Warning]: ${message}`, ...params);
  }
};

/**
 * Logs an error to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 * @param params - Additional arguments to supply to the console.error.
 */
export const printIonError = (message: string, ...params: any[]) => {
  if (isLogLevelEnabled(LogLevel.ERROR)) {
    return console.error(`[Ionic Error]: ${message}`, ...params);
  }
};

/**
 * Prints an error informing developers that an implementation requires an element to be used
 * within a specific selector.
 *
 * @param el The web component element this is requiring the element.
 * @param targetSelectors The selector or selectors that were not found.
 */
export const printRequiredElementError = (el: HTMLElement, ...targetSelectors: string[]) => {
  return console.error(`<${el.tagName.toLowerCase()}> must be used inside ${targetSelectors.join(' or ')}.`);
};
