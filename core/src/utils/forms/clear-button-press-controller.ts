import { doc } from '@utils/browser';

/**
 * Tracks an in-flight press on a clear button so a blur landing mid-press can't
 * hide or unmount the button before the press produces its click.
 *
 * Calling `preventDefault()` on `pointerdown` is meant to stop the field
 * blurring, but not every browser honors it (iOS Safari blurs anyway). The
 * press is released on `click` rather than `pointerup` because touch
 * dispatches the click after the finger lifts.
 *
 * @internal
 * @param onPressChange Receives the press state.
 */
export const createClearButtonPressController = (
  onPressChange: (isPressed: boolean) => void
): ClearButtonPressController => {
  const release = () => {
    doc?.removeEventListener('click', release);

    onPressChange(false);
  };

  const onPointerDown = (ev: PointerEvent) => {
    ev.preventDefault();

    // Only a primary press produces a click.
    if (ev.button !== 0) {
      return;
    }

    onPressChange(true);

    doc?.addEventListener('click', release, { once: true });
  };

  // Teardown also clears the press, so a disconnect mid-press can't leave the button stuck visible.
  const destroy = () => {
    release();
  };

  return {
    onPointerDown,
    release,
    destroy,
  };
};

export type ClearButtonPressController = {
  onPointerDown: (ev: PointerEvent) => void;
  /** Ends the press without waiting for a click. */
  release: () => void;
  /** Ends any in-flight press. The controller stays usable if the host reconnects. */
  destroy: () => void;
};
