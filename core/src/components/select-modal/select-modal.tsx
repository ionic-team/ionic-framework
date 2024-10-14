import { getIonTheme } from '@global/ionic-global';
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
    ios: 'select-modal.scss',
    md: 'select-modal.scss',
    ionic: 'select-modal.scss',
  },
  scoped: true,
})
export class SelectModal implements ComponentInterface {
  @Element() el!: HTMLIonSelectModalElement;

  @Prop() header?: string;

  @Prop() multiple?: boolean;

  // TODO(ROU-11272): Not needed if we follow popover's behavior for multi-select (i.e. no confirmation button)
  @Prop() confirmHandler?: (value?: any | null) => void;

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
      // this is a popover with checkboxes (multiple value select)
      // return an array of all the checked values
      return options.filter((o) => o.checked).map((o) => o.value);
    }

    // this is a popover with radio buttons (single value select)
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

    // this is a popover with checkboxes (multiple value select)
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
            class={{
              // TODO FW-4784
              'item-radio-checked': option.value === checked,
              ...getClassMap(option.cssClass),
            }}
          >
            <ion-radio
              value={option.value}
              disabled={option.disabled}
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
          justify="space-between"
          labelPlacement="start"
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
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
        }}
      >
        {this.header !== undefined && (
          <ion-header>
            <ion-toolbar>
              <ion-title>{this.header}</ion-title>
            </ion-toolbar>
          </ion-header>
        )}
        <ion-content>
          <ion-list>{this.multiple === true ? this.renderCheckboxOptions() : this.renderRadioOptions()}</ion-list>
        </ion-content>
        {/* TODO(ROU-11272): Design did not provide designs for how this component should work for multi-select.
         * `ion-select-popover` automatically posts data back to the select component, but this feels like an incorrect pattern for modals.
         * We'll need to chat with design to figure out the desired UI/UX here.
         */}
        {this.multiple === true && (
          <ion-footer>
            <ion-toolbar>
              <ion-buttons slot="end">
                <ion-button
                  onClick={() => {
                    this.confirmHandler?.(this.getValues());
                    this.closeModal();
                  }}
                >
                  Done
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-footer>
        )}
      </Host>
    );
  }
}
