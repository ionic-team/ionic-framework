import { PointerCoordinates } from '../util/dom';

export abstract class ActivatorBase {

  abstract clickAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;

  abstract downAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;

  abstract upAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;

  abstract clearState(animated: boolean): void;
}

export function isActivatedDisabled(ev: any, activatableEle: any): boolean {
  if (!activatableEle || !activatableEle.parentNode) {
    return true;
  }
  if (!ev) {
    return false;
  }
  if (ev.defaultPrevented) {
    return true;
  }

  let targetEle = ev.target;
  for (let i = 0; i < 4; i++) {
    if (!targetEle) {
      break;
    }
    if (targetEle.hasAttribute('disable-activated')) {
      return true;
    }
    targetEle = targetEle.parentElement;
  }
  return false;
}
