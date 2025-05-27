import { getIonMode } from '@global/ionic-global';
import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, forceUpdate, h } from '@stencil/core';
import { safeCall } from '@utils/overlays';
import { getClassMap } from '@utils/theme';

import type { CheckboxCustomEvent } from '../checkbox/checkbox-interface';
import type { RadioGroupCustomEvent } from '../radio-group/radio-group-interface';

import type { SelectModalOption } from './select-modal-interface';

@Component({
  tag: 'ion-select-modal',
  styleUrls: {
    ios: 'select-modal.ios.scss',
    md: 'select-modal.md.scss',
    ionic: 'select-modal.md.scss',
  },
  scoped: true,
})
export class SelectModal implements ComponentInterface {
  @Element() el!: HTMLIonSelectModalElement;

  @Prop() header?: string;

  @Prop() multiple?: boolean;

  @Prop() options: SelectModalOption[] = [];

  private closeModal() {
    const modal = this.el.closest('ion-modal');

    if (modal) {
      modal.dismiss();
    }
  }

  private findOptionFromEvent(ev: CheckboxCustomEvent | RadioGroupCustomEvent) {
    const { options } = this;
    return options.find((o) => o.value === ev.target.value);
  }

  private getValues(ev?: CheckboxCustomEvent | RadioGroupCustomEvent): string | string[] | undefined {
    const { multiple, options } = this;

    if (multiple) {
      // this is a modal with checkboxes (multiple value select)
      // return an array of all the checked values
      return options.filter((o) => o.checked).map((o) => o.value);
    }

    // this is a modal with radio buttons (single value select)
    // return the value that was clicked, otherwise undefined
    const option = ev ? this.findOptionFromEvent(ev) : null;
    return option ? option.value : undefined;
  }

  private callOptionHandler(ev: CheckboxCustomEvent | RadioGroupCustomEvent) {
    const option = this.findOptionFromEvent(ev);
    const values = this.getValues(ev);
    if (option?.handler) {
      safeCall(option.handler, values);
    }
  }

  private setChecked(ev: CheckboxCustomEvent): void {
    const { multiple } = this;
    const option = this.findOptionFromEvent(ev);

    // this is a modal with checkboxes (multiple value select)
    // we need to set the checked value for this option
    if (multiple && option) {
      option.checked = ev.detail.checked;
    }
  }

  private renderRadioOptions() {
    const checked = this.options.filter((o) => o.checked).map((o) => o.value)[0];

    return (
      <ion-radio-group value={checked} onIonChange={(ev) => this.callOptionHandler(ev)}>
        {this.options.map((option) => (
          <ion-item
            lines="none"
            class={{
              // TODO FW-4784
              'item-radio-checked': option.value === checked,
              ...getClassMap(option.cssClass),
            }}
          >
            <ion-radio
              value={option.value}
              disabled={option.disabled}
              justify="start"
              labelPlacement="end"
              onClick={() => this.closeModal()}
              onKeyUp={(ev) => {
                if (ev.key === ' ') {
                  /**
                   * Selecting a radio option with keyboard navigation,
                   * either through the Enter or Space keys, should
                   * dismiss the modal.
                   */
                  this.closeModal();
                }
              }}
            >
              {option.text}
            </ion-radio>
          </ion-item>
        ))}
      </ion-radio-group>
    );
  }

  private renderCheckboxOptions() {
    return this.options.map((option) => (
      <ion-item
        class={{
          // TODO FW-4784
          'item-checkbox-checked': option.checked,
          ...getClassMap(option.cssClass),
        }}
      >
        <ion-checkbox
          value={option.value}
          disabled={option.disabled}
          checked={option.checked}
          justify="start"
          labelPlacement="end"
          onIonChange={(ev) => {
            this.setChecked(ev);
            this.callOptionHandler(ev);
            // TODO FW-4784
            forceUpdate(this);
          }}
        >
          {option.text}
        </ion-checkbox>
      </ion-item>
    ));
  }

  render() {
    return (
      <Host class={getIonMode(this)}>
        <ion-header>
          <ion-toolbar>
            {this.header !== undefined && <ion-title>{this.header}</ion-title>}

            <ion-buttons slot="end">
              <ion-button onClick={() => this.closeModal()}>Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>{this.multiple === true ? this.renderCheckboxOptions() : this.renderRadioOptions()}</ion-list>
        </ion-content>
      </Host>
    );
  }
}
