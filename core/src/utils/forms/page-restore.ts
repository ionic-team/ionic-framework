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
 * @param ev The `pageshow` event. Only a restored page (`persisted`) is checked.
 * @param nativeInput The input whose text is read on each check.
 * @param getValue Returns the component's value when each check runs.
 * @param onValueChange Called with the field's text when it differs from the value.
 */
export const syncValueOnPageRestore = (
  ev: PageTransitionEvent,
  nativeInput: HTMLInputElement | undefined,
  getValue: () => string,
  onValueChange: (value: string) => void
) => {
  if (!ev.persisted || !nativeInput) {
    return;
  }

  const start = Date.now();

  const check = () => {
    if (nativeInput.value !== getValue()) {
      onValueChange(nativeInput.value);
      return;
    }

    if (Date.now() - start < PAGE_RESTORE_CHECK_DURATION) {
      raf(check);
    }
  };

  raf(check);
};
