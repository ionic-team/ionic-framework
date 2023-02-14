import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { safeCall } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';

import type { SelectPopoverOption } from './select-popover-interface';

// TODO(FW-2832): types

/**
 * @internal
 */
@Component({
  tag: 'ion-select-popover',
  styleUrls: {
    ios: 'select-popover.ios.scss',
    md: 'select-popover.md.scss',
  },
  scoped: true,
})
export class SelectPopover implements ComponentInterface {
  /**
   * The header text of the popover
   */
  @Prop() header?: string;

  /**
   * The subheader text of the popover
   */
  @Prop() subHeader?: string;

  /**
   * The text content of the popover body
   */
  @Prop() message?: string;

  /**
   * If true, the select accepts multiple values
   */
  @Prop() multiple?: boolean;

  /**
   * An array of options for the popover
   */
  @Prop() options: SelectPopoverOption[] = [];

  private findOptionFromEvent(ev: any) {
    const { options } = this;
    return options.find((o) => o.value === ev.target.value);
  }

  /**
   * When an option is selected we need to get the value(s)
   * of the selected option(s) and return it in the option
   * handler
   */
  private callOptionHandler(ev: any) {
    const option = this.findOptionFromEvent(ev);
    const values = this.getValues(ev);

    if (option?.handler) {
      safeCall(option.handler, values);
    }
  }

  /**
   * This is required when selecting a radio that is already
   * selected because it will not trigger the ionChange event
   * but we still want to close the popover
   */
  private rbClick(ev: any) {
    this.callOptionHandler(ev);
  }

  private setChecked(ev: any): void {
    const { multiple } = this;
    const option = this.findOptionFromEvent(ev);

    // this is a popover with checkboxes (multiple value select)
    // we need to set the checked value for this option
    if (multiple && option) {
      option.checked = ev.detail.checked;
    }
  }

  private getValues(ev: any): any | any[] | null {
    const { multiple, options } = this;

    if (multiple) {
      // this is a popover with checkboxes (multiple value select)
      // return an array of all the checked values
      return options.filter((o) => o.checked).map((o) => o.value);
    }

    // this is a popover with radio buttons (single value select)
    // return the value that was clicked, otherwise undefined
    const option = this.findOptionFromEvent(ev);
    return option ? option.value : undefined;
  }

  renderOptions(options: SelectPopoverOption[]) {
    const { multiple } = this;

    switch (multiple) {
      case true:
        return this.renderCheckboxOptions(options);
      default:
        return this.renderRadioOptions(options);
    }
  }

  renderCheckboxOptions(options: SelectPopoverOption[]) {
    return options.map((option) => (
      <ion-item class={getClassMap(option.cssClass)}>
        <ion-checkbox
          slot="start"
          value={option.value}
          disabled={option.disabled}
          checked={option.checked}
          onIonChange={(ev) => {
            this.setChecked(ev);
            this.callOptionHandler(ev);
          }}
        ></ion-checkbox>
        <ion-label>{option.text}</ion-label>
      </ion-item>
    ));
  }

  renderRadioOptions(options: SelectPopoverOption[]) {
    const checked = options.filter((o) => o.checked).map((o) => o.value)[0];

    return (
      <ion-radio-group value={checked}>
        {options.map((option) => (
          <ion-item class={getClassMap(option.cssClass)}>
            <ion-label>{option.text}</ion-label>
            <ion-radio value={option.value} disabled={option.disabled} onClick={(ev) => this.rbClick(ev)}></ion-radio>
          </ion-item>
        ))}
      </ion-radio-group>
    );
  }

  render() {
    const { header, message, options, subHeader } = this;
    const hasSubHeaderOrMessage = subHeader !== undefined || message !== undefined;

    return (
      <Host class={getIonMode(this)}>
        <ion-list>
          {header !== undefined && <ion-list-header>{header}</ion-list-header>}
          {hasSubHeaderOrMessage && (
            <ion-item>
              <ion-label class="ion-text-wrap">
                {subHeader !== undefined && <h3>{subHeader}</h3>}
                {message !== undefined && <p>{message}</p>}
              </ion-label>
            </ion-item>
          )}
          {this.renderOptions(options)}
        </ion-list>
      </Host>
    );
  }
}
