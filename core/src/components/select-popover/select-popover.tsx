import type { ComponentInterface } from '@stencil/core';
import { Element, Component, Host, Prop, h } from '@stencil/core';
import { safeCall } from '@utils/overlays';
import { getClassMap } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { CheckboxCustomEvent } from '../checkbox/checkbox-interface';
import type { RadioGroupCustomEvent } from '../radio-group/radio-group-interface';

import type { SelectPopoverOption } from './select-popover-interface';

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
  @Element() el!: HTMLIonSelectPopoverElement;
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

  private findOptionFromEvent(ev: CheckboxCustomEvent | RadioGroupCustomEvent) {
    const { options } = this;
    return options.find((o) => o.value === ev.target.value);
  }

  /**
   * When an option is selected we need to get the value(s)
   * of the selected option(s) and return it in the option
   * handler
   */
  private callOptionHandler(ev: CheckboxCustomEvent | RadioGroupCustomEvent) {
    const option = this.findOptionFromEvent(ev);
    const values = this.getValues(ev);

    if (option?.handler) {
      safeCall(option.handler, values);
    }
  }

  /**
   * Dismisses the host popover that the `ion-select-popover`
   * is rendered within.
   */
  private dismissParentPopover() {
    const popover = this.el.closest('ion-popover');
    if (popover) {
      popover.dismiss();
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

  private getValues(ev: CheckboxCustomEvent | RadioGroupCustomEvent): string | string[] | undefined {
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
          legacy={true}
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
      <ion-radio-group value={checked} onIonChange={(ev) => this.callOptionHandler(ev)}>
        {options.map((option) => (
          <ion-item class={getClassMap(option.cssClass)}>
            <ion-label>{option.text}</ion-label>
            <ion-radio
              value={option.value}
              disabled={option.disabled}
              legacy={true}
              onClick={() => this.dismissParentPopover()}
              onKeyUp={(ev) => {
                if (ev.key === ' ') {
                  /**
                   * Selecting a radio option with keyboard navigation,
                   * either through the Enter or Space keys, should
                   * dismiss the popover.
                   */
                  this.dismissParentPopover();
                }
              }}
            ></ion-radio>
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
