import { writeTask } from '@stencil/core';

import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '../native/haptic';

import { Gesture, createGesture } from './index';

export const createButtonActiveGesture = (
  el: HTMLElement,
  isButton: (refEl: HTMLElement) => boolean
): Gesture => {
  let touchedButton: HTMLElement | undefined;

  const activateButtonAtPoint = (x: number, y: number, hapticFeedbackFn: () => void) => {
    if (typeof (document as any) === 'undefined') { return; }
    const target = document.elementFromPoint(x, y) as HTMLElement | null;
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
    const buttonToModify = touchedButton;
    writeTask(() => buttonToModify.classList.add('ion-activated'));
    hapticFeedbackFn();
  };

  const clearActiveButton = (dispatchClick = false) => {
    if (!touchedButton) { return; }

    const buttonToModify = touchedButton;
    writeTask(() => buttonToModify.classList.remove('ion-activated'));

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
