import { Component, Listen, Method } from '@stencil/core';
import { Picker, PickerEvent, PickerOptions } from '../../index';


@Component({
  tag: 'ion-picker-controller'
})
export class PickerController {
  private ids = 0;
  private pickerResolves: {[pickerId: string]: Function} = {};
  private pickers: Picker[] = [];

  @Method()
  create(opts?: PickerOptions): Promise<Picker> {
    // create ionic's wrapping ion-picker component
    const picker = document.createElement('ion-picker');

    const id = this.ids++;

    // give this picker a unique id
    picker.id = `picker-${id}`;
    picker.style.zIndex = (20000 + id).toString();

    // convert the passed in picker options into props
    // that get passed down into the new picker
    Object.assign(picker, opts);

    // append the picker element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(picker as any);

    // store the resolve function to be called later up when the picker loads
    return new Promise<Picker>(resolve => {
      this.pickerResolves[picker.id] = resolve;
    });
  }


  @Listen('body:ionPickerDidLoad')
  protected viewDidLoad(ev: PickerEvent) {
    const picker = ev.detail.picker;
    const pickerResolve = this.pickerResolves[picker.id];
    if (pickerResolve) {
      pickerResolve(picker);
      delete this.pickerResolves[picker.id];
    }
  }


  @Listen('body:ionPickerWillPresent')
  protected willPresent(ev: PickerEvent) {
    this.pickers.push(ev.detail.picker);
  }


  @Listen('body:ionPickerWillDismiss, body:ionPickerDidUnload')
  protected willDismiss(ev: PickerEvent) {
    const index = this.pickers.indexOf(ev.detail.picker);
    if (index > -1) {
      this.pickers.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastPicker = this.pickers[this.pickers.length - 1];
    if (lastPicker) {
      lastPicker.dismiss();
    }
  }

}
