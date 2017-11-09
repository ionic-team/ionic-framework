
import { Component, Event, EventEmitter, Listen, Prop, PropDidChange } from '@stencil/core';

import { ComponentDetail, ComponentEvent } from '../../index';

export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  handler?: Function;
}

@Component({
  tag: 'ion-select-popover',
  host: {
    theme: 'select-popover'
  }}
)
export class SelectPopover {
  mode: string;
  color: string;

  /**
   * @output {ComponentEvent} Emitted when the select popover is dismissed.
   */
  @Event() ionDismiss: EventEmitter<ComponentDetail<SelectPopover>>;

  @Prop() options: SelectPopoverOption[];

  /**
   * @input {string} the value of the select popover.
   */
  @Prop({ mutable: true }) value: string;

  @Listen('ionChange')
  onChange(ev: ComponentEvent<SelectPopover>) {
    this.value = ev.detail.component.value;
  }

  // public get value() {
  //   let checkedOption = this.options.find(option => option.checked);

  //   return checkedOption ? checkedOption.value : undefined;
  // }

  dismiss(value: any) {
    this.ionDismiss.emit(value);
  }

  @PropDidChange('value')
  protected valueChanged(value: string) {
    let checkedOption = this.options.find(option => option.value === value);
    if (checkedOption && checkedOption.handler) {
      checkedOption.handler();
    }
    this.dismiss(value);
  }

  protected render() {
    return (
      <ion-list no-lines={this.mode === 'md'}>
        <ion-radio-group value={this.value}>
          {this.options.map(option =>
            <ion-item>
              <ion-label>
                {option.text}
              </ion-label>
              <ion-radio
                checked={option.checked}
                value={option.value}
                disabled={option.disabled}>
              </ion-radio>
            </ion-item>
          )}
        </ion-radio-group>
      </ion-list>
    );
  }
}


