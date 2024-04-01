import type { BackButtonEvent } from '@utils/hardware-back-button';

/**
 * When accessing the document or window, it is important
 * to account for SSR applications where the
 * window is not available. Code that accesses
 * window when it is not available will crash.
 * Even checking if `window === undefined` will cause
 * apps to crash in SSR.
 *
 * Use win below to access an SSR-safe version
 * of the window.
 *
 * Example 1:
 * Before:
 * if (window.innerWidth > 768) { ... }
 *
 * After:
 * import { win } from 'path/to/this/file';
 * if (win?.innerWidth > 768) { ... }
 *
 * Note: Code inside of this if-block will
 * not run in an SSR environment.
 */

/**
 * Event listeners on the window typically expect
 * Event types for the listener parameter. If you want to listen
 * on the window for certain CustomEvent types you can add that definition
 * here as long as you are using the "win" utility below.
 */
type IonicEvents = {
  addEventListener(
    type: 'ionKeyboardDidShow',
    listener: (
      ev: CustomEvent<{
        keyboardHeight: number;
      }>
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'ionKeyboardDidShow',
    listener: (
      ev: CustomEvent<{
        keyboardHeight: number;
      }>
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'ionInputDidLoad',
    listener: (
      ev: CustomEvent<
        | HTMLIonInputElement
        | HTMLIonTextareaElement
      >
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'ionInputDidLoad',
    listener: (
      ev: CustomEvent<
        | HTMLIonInputElement
        | HTMLIonTextareaElement
      >
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'ionInputDidUnload',
    listener: (
      ev: CustomEvent<
        | HTMLIonInputElement
        | HTMLIonTextareaElement
      >
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'ionInputDidUnload',
    listener: (
      ev: CustomEvent<
        | HTMLIonInputElement
        | HTMLIonTextareaElement
      >
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'ionBackButton',
    listener: (
      ev: BackButtonEvent
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'ionBackButton',
    listener: (
      ev: BackButtonEvent
    ) => void,
    options?:
      | boolean
      | AddEventListenerOptions
  ): void;
};

export interface CloseWatcher
  extends EventTarget {
  new (
    options?: CloseWatcherOptions
  ): any;
  requestClose(): void;
  close(): void;
  destroy(): void;

  oncancel: (
    event: Event
  ) => void | null;
  onclose: (
    event: Event
  ) => void | null;
}

interface CloseWatcherOptions {
  signal: AbortSignal;
}

/**
 * Experimental browser features that
 * are selectively used inside of Ionic
 * Since they are experimental they typically
 * do not have types yet, so we can add custom ones
 * here until types are available.
 */
type ExperimentalWindowFeatures = {
  CloseWatcher?: CloseWatcher;
};

type IonicWindow = Window &
  IonicEvents &
  ExperimentalWindowFeatures;
type IonicDocument = Document &
  IonicEvents;

export const win:
  | IonicWindow
  | undefined =
  typeof window !== 'undefined'
    ? window
    : undefined;

export const doc:
  | IonicDocument
  | undefined =
  typeof document !== 'undefined'
    ? document
    : undefined;
