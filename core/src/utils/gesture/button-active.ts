import { raf } from '../helpers';
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '../native/haptic';

import { Gesture, createGesture } from './index';

export const createButtonActiveGesture = (
  el: HTMLElement,
  isButton: (refEl: HTMLElement) => boolean
): Gesture => {
  let touchedButton: HTMLElement | undefined;

  const activateButtonAtPoint = (x: number, y: number, hapticFeedbackFn: () => void) => {
    const target = document.elementFromPoint(x, y) as HTMLElement | null;
    console.log(target);
    if (!target || !isButton(target)) {
      clearActiveButton();
      return;
    }

    if (target !== touchedButton) {
      clearActiveButton();
      setActiveButton(target, hapticFeedbackFn);
    }
  };

  const setActiveButton = (button: HTMLElement, hapticFeedbackFn: () => void) => {
    touchedButton = button;
    raf(() => touchedButton!.classList.add('ion-activated'));
    hapticFeedbackFn();
  };

  const clearActiveButton = (dispatchClick = false) => {
    if (!touchedButton) { return; }

    touchedButton!.classList.remove('ion-activated');

    if (dispatchClick) {
      touchedButton.click();
    }

    touchedButton = undefined;
  };

  return createGesture({
    el,
    gestureName: 'buttonActiveDrag',
    threshold: 0,
    onStart: ev => activateButtonAtPoint(ev.currentX, ev.currentY, hapticSelectionStart),
    onMove: ev => activateButtonAtPoint(ev.currentX, ev.currentY, hapticSelectionChanged),
    onEnd: () => {
      clearActiveButton(true);
      hapticSelectionEnd();
    }
  });
};
