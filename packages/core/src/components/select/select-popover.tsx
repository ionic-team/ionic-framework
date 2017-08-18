
import { Component, Prop, PropDidChange } from '@stencil/core';

export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  handler?: Function;
}

@Component({
  tag: 'ion-select-popover'
})
export class SelectPopover {
  @Prop() options: SelectPopoverOption[];

  @Prop({ state: true }) value: string;

  @PropDidChange('value')
  valueChanged(val: string) {
    console.log('Select popover value', val);
  }

  // public get value() {
  //   let checkedOption = this.options.find(option => option.checked);

  //   return checkedOption ? checkedOption.value : undefined;
  // }

  // public set value(value: any) {
  //   let checkedOption = this.options.find(option => option.value === value);
  //   if (checkedOption && checkedOption.handler) {
  //     checkedOption.handler();
  //   }
  //   this.viewController.dismiss(value);
  // }

  render() {
    console.log(this.options);

    return (
      <ion-list radio-group value="{this.value}">
        {this.options.map(option =>
          <ion-item>
            <ion-label>{option.text}</ion-label>
            <ion-radio checked={option.checked} value={option.value} disabled={option.disabled}></ion-radio>
          </ion-item>
        )}
      </ion-list>
    );
  }
}


