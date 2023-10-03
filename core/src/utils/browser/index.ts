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
type IonicWindow = Window & {
  addEventListener(
    type: 'ionKeyboardDidShow',
    listener: (ev: CustomEvent<{ keyboardHeight: number }>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'ionKeyboardDidShow',
    listener: (ev: CustomEvent<{ keyboardHeight: number }>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
};

export const win: IonicWindow | undefined = typeof window !== 'undefined' ? window : undefined;

export const doc: Document | undefined = typeof document !== 'undefined' ? document : undefined;
