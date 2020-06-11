import { writeTask } from '@stencil/core';

import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from '../native/haptic';

import { Gesture, createGesture } from './index';

export const createButtonActiveGesture = (
  el: HTMLElement,
  isButton: (refEl: HTMLElement) => boolean
): Gesture => {
  let currentTouchedButton: HTMLElement | undefined;
  let initialTouchedButton: HTMLElement | undefined;

  const activateButtonAtPoint = (x: number, y: number, hapticFeedbackFn: () => void) => {
    if (typeof (document as any) === 'undefined') { return; }
    const target = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!target || !isButton(target)) {
      clearActiveButton();
      return;
    }

    if (target !== currentTouchedButton) {
      clearActiveButton();
      setActiveButton(target, hapticFeedbackFn);
    }
  };

  const setActiveButton = (button: HTMLElement, hapticFeedbackFn: () => void) => {
    currentTouchedButton = button;

    if (!initialTouchedButton) {
      initialTouchedButton = currentTouchedButton;
    }

    const buttonToModify = currentTouchedButton;
    writeTask(() => buttonToModify.classList.add('ion-activated'));
    hapticFeedbackFn();
  };

  const clearActiveButton = (dispatchClick = false) => {
    if (!currentTouchedButton) { return; }

    const buttonToModify = currentTouchedButton;
    writeTask(() => buttonToModify.classList.remove('ion-activated'));

    if (dispatchClick && initialTouchedButton !== currentTouchedButton) {
      currentTouchedButton.click();
    }

    currentTouchedButton = undefined;
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
      initialTouchedButton = undefined;
    }
  });
};
