/**
 * These types are public, so they live apart from haptic.ts. Its
 * `@capacitor/haptics` import would otherwise end up in the published
 * types, and apps without that package would fail to compile.
 */

/**
 * Detail of the `ionHaptic` event. `type` matches the Capacitor Haptics
 * method Ionic would call, except `selection`, which Ionic plays as a
 * light impact. The haptic engine only plays `selectionChanged` after a
 * `selectionStart`, so canceling `selectionStart` also silences the rest
 * of that gesture. `selectionEnd` plays nothing and only releases the
 * engine, so canceling it has no effect.
 */
export type HapticEventDetail =
  | { type: 'selection' | 'selectionStart' | 'selectionChanged' | 'selectionEnd' }
  | { type: 'impact'; style: 'HEAVY' | 'MEDIUM' | 'LIGHT' }
  | { type: 'notification'; notificationType: 'SUCCESS' | 'WARNING' | 'ERROR' };

export type HapticEvent = CustomEvent<HapticEventDetail>;
