import { printIonWarning } from '@utils/logging';

export function warnIfAnchorIsHidden(positionAnchor: HTMLElement, toast: HTMLElement) {
  if (positionAnchor.offsetParent === null) {
    printIonWarning(
      'The positionAnchor element for ion-toast was found in the DOM, but appears to be hidden. This may lead to unexpected positioning of the toast.',
      toast
    );
  }
}
