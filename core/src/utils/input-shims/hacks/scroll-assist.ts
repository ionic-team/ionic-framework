import { pointerCoord } from '../../helpers';

import { isFocused, relocateInput } from './common';
import { getScrollData } from './scroll-data';

export const enableScrollAssist = (
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  contentEl: HTMLIonContentElement,
  keyboardHeight: number
) => {
  let coord: any;
  const touchStart = (ev: Event) => {
    coord = pointerCoord(ev);
  };

  const touchEnd = (ev: Event) => {
    // input cover touchend/mouseup
    if (!coord) {
      return;
    }
    // get where the touchend/mouseup ended
    const endCoord = pointerCoord(ev);

    // focus this input if the pointer hasn't moved XX pixels
    // and the input doesn't already have focus
    if (!hasPointerMoved(6, coord, endCoord) && !isFocused(inputEl)) {
      ev.preventDefault();
      ev.stopPropagation();

      // begin the input focus process
      jsSetFocus(inputEl, contentEl, keyboardHeight);
    }
  };
  inputEl.addEventListener('touchstart', touchStart, true);
  inputEl.addEventListener('touchend', touchEnd, true);

  return () => {
    inputEl.removeEventListener('touchstart', touchStart, true);
    inputEl.removeEventListener('touchend', touchEnd, true);
  };
};

const jsSetFocus = (
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  contentEl: HTMLIonContentElement,
  keyboardHeight: number
) => {
  const scrollData = getScrollData(inputEl, contentEl, keyboardHeight);
  if (scrollData.inputSafeY === 0) {
    // the text input is in a safe position that doesn't
    // require it to be scrolled into view, just set focus now
    inputEl.focus();
    return;
  }

  // temporarily move the focus to the focus holder so the browser
  // doesn't freak out while it's trying to get the input in place
  // at this point the native text input still does not have focus
  relocateInput(inputEl, true, scrollData.inputSafeY);
  inputEl.focus();

  // scroll the input into place
  contentEl.scrollByPoint(0, scrollData.scrollAmount, scrollData.scrollDuration).then(() => {
    // the scroll view is in the correct position now
    // give the native text input focus
    relocateInput(inputEl, false, scrollData.inputSafeY);

    // ensure this is the focused input
    inputEl.focus();
  });
};

const hasPointerMoved = (threshold: number, startCoord: PointerCoordinates | undefined, endCoord: PointerCoordinates | undefined) => {
  if (startCoord && endCoord) {
    const deltaX = (startCoord.x - endCoord.x);
    const deltaY = (startCoord.y - endCoord.y);
    const distance = deltaX * deltaX + deltaY * deltaY;
    return distance > (threshold * threshold);
  }
  return false;
};

export interface PointerCoordinates {
  x: number;
  y: number;
}
