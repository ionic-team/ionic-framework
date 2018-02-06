import { Component, Listen, Method } from '@stencil/core';
import { PickerEvent, PickerOptions, OverlayController } from '../../index';

let ids = 0;
const pickers = new Map<number, HTMLIonPickerElement>();

@Component({
  tag: 'ion-picker-controller'
})
export class PickerController implements OverlayController {

  @Method()
  create(opts?: PickerOptions): Promise<HTMLIonPickerElement> {
    // create ionic's wrapping ion-picker component
    const pickerElement = document.createElement('ion-picker');

    // give this picker a unique id
    pickerElement.pickerId = ids++;

    // convert the passed in picker options into props
    // that get passed down into the new picker
    Object.assign(pickerElement, opts);

    // append the picker element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(pickerElement);

    return (pickerElement as any).componentOnReady();
  }

  @Method()
  dismiss(data?: any, role?: any, pickerId = -1) {
    pickerId = pickerId >= 0 ? pickerId : getHighestId();
    const picker = pickers.get(pickerId);
    return picker.dismiss(data, role);
  }

  @Method()
  getTop() {
    return pickers.get(getHighestId());
  }

  @Listen('body:ionPickerWillPresent')
  protected pickerWillPresent(ev: PickerEvent) {
    pickers.set(ev.target.pickerId, ev.target);
  }


  @Listen('body:ionPickerWillDismiss, body:ionPickerDidUnload')
  protected pickerWillDismiss(ev: PickerEvent) {
    pickers.delete(ev.target.pickerId);
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastPicker();
  }
}

function getHighestId() {
  let minimum = -1;
  pickers.forEach((_picker: HTMLIonPickerElement, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

function removeLastPicker() {
  const toRemove = pickers.get(getHighestId());
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}
