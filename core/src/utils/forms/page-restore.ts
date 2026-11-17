import { raf } from '@utils/helpers';

/**
 * How long, in milliseconds, the field is checked after a restore. The clear
 * can land a few frames after `pageshow`, such as when Web Inspector is open.
 */
export const PAGE_RESTORE_CHECK_DURATION = 500;

/**
 * Safari clears password and autocomplete="off" fields after restoring a
 * page from the back/forward cache, without firing `input`. The clear lands
 * after `pageshow`, so the field is checked each frame until it differs from
 * the value or the check duration ends.
 *
 * A cleared password field stays cleared, as a native one does, and the
 * value follows it. Any other field is cleared only because autocomplete
 * defaults to "off", so its text is put back from the value.
 *
 * @param ev The `pageshow` event. Only a restored page (`persisted`) is checked.
 * @param nativeInput The input whose text is read on each check.
 * @param getValue Returns the component's value when each check runs.
 * @param onPasswordCleared Called with the field's text when a password field differs from the value.
 */
export const syncValueOnPageRestore = (
  ev: PageTransitionEvent,
  nativeInput: HTMLInputElement | undefined,
  getValue: () => string,
  onPasswordCleared: (value: string) => void
) => {
  if (!ev.persisted || !nativeInput) {
    return;
  }

  const start = Date.now();

  const check = () => {
    const value = getValue();

    if (nativeInput.value !== value) {
      if (nativeInput.type === 'password') {
        onPasswordCleared(nativeInput.value);
      } else {
        nativeInput.value = value;
      }
      return;
    }

    if (Date.now() - start < PAGE_RESTORE_CHECK_DURATION) {
      raf(check);
    }
  };

  raf(check);
};
