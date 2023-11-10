import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Method, Prop, Watch, h } from '@stencil/core';
import { printIonWarning } from '@utils/logging';

import { getIonMode } from '../../global/ionic-global';

import type { AccordionGroupChangeEventDetail } from './accordion-group-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-accordion-group',
  styleUrls: {
    ios: 'accordion-group.ios.scss',
    md: 'accordion-group.md.scss',
  },
  shadow: true,
})
export class AccordionGroup implements ComponentInterface {
  @Element() el!: HTMLIonAccordionGroupElement;

  /**
   * If `true`, all accordions inside of the
   * accordion group will animate when expanding
   * or collapsing.
   */
  @Prop() animated = true;

  /**
   * If `true`, the accordion group can have multiple
   * accordion components expanded at the same time.
   */
  @Prop() multiple?: boolean;

  /**
   * The value of the accordion group. This controls which
   * accordions are expanded.
   * This should be an array of strings only when `multiple="true"`
   */
  @Prop({ mutable: true }) value?: string | string[] | null;

  /**
   * If `true`, the accordion group cannot be interacted with.
   */
  @Prop() disabled = false;

  /**
   * If `true`, the accordion group cannot be interacted with,
   * but does not alter the opacity.
   */
  @Prop() readonly = false;

  /**
   * Describes the expansion behavior for each accordion.
   * Possible values are `"compact"` and `"inset"`.
   * Defaults to `"compact"`.
   */
  @Prop() expand: 'compact' | 'inset' = 'compact';

  /**
   * Emitted when the value property has changed
   * as a result of a user action such as a click.
   * This event will not emit when programmatically setting
   * the value property.
   */
  @Event() ionChange!: EventEmitter<AccordionGroupChangeEventDetail>;

  /**
   * Emitted when the value property has changed.
   * This is used to ensure that ion-accordion can respond
   * to any value property changes.
   * @internal
   */
  @Event() ionValueChange!: EventEmitter<AccordionGroupChangeEventDetail>;

  @Watch('value')
  valueChanged() {
    const { value, multiple } = this;

    if (!multiple && Array.isArray(value)) {
      /**
       * We do some processing on the `value` array so
       * that it looks more like an array when logged to
       * the console.
       * Example given ['a', 'b']
       * Default toString() behavior: a,b
       * Custom behavior: ['a', 'b']
       */
      printIonWarning(
        `ion-accordion-group was passed an array of values, but multiple="false". This is incorrect usage and may result in unexpected behaviors. To dismiss this warning, pass a string to the "value" property when multiple="false".

  Value Passed: [${value.map((v) => `'${v}'`).join(', ')}]
`,
        this.el
      );
    }

    /**
     * Do not use `value` here as that will be
     * not account for the adjustment we make above.
     */
    this.ionValueChange.emit({ value: this.value });
  }

  @Watch('disabled')
  async disabledChanged() {
    const { disabled } = this;
    const accordions = await this.getAccordions();
    for (const accordion of accordions) {
      accordion.disabled = disabled;
    }
  }

  @Watch('readonly')
  async readonlyChanged() {
    const { readonly } = this;
    const accordions = await this.getAccordions();
    for (const accordion of accordions) {
      accordion.readonly = readonly;
    }
  }

  @Listen('keydown')
  async onKeydown(ev: KeyboardEvent) {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return;
    }

    /**
     * Make sure focus is in the header, not the body, of the accordion. This ensures
     * that if there are any interactable elements in the body, their keyboard
     * interaction doesn't get stolen by the accordion. Example: using up/down keys
     * in ion-textarea.
     */
    const activeAccordionHeader = activeElement.closest('ion-accordion [slot="header"]');
    if (!activeAccordionHeader) {
      return;
    }

    const accordionEl =
      activeElement.tagName === 'ION-ACCORDION' ? activeElement : activeElement.closest('ion-accordion');
    if (!accordionEl) {
      return;
    }

    const closestGroup = accordionEl.closest('ion-accordion-group');
    if (closestGroup !== this.el) {
      return;
    }

    // If the active accordion is not in the current array of accordions, do not do anything
    const accordions = await this.getAccordions();
    const startingIndex = accordions.findIndex((a) => a === accordionEl);
    if (startingIndex === -1) {
      return;
    }

    let accordion: HTMLIonAccordionElement | undefined;
    if (ev.key === 'ArrowDown') {
      accordion = this.findNextAccordion(accordions, startingIndex);
    } else if (ev.key === 'ArrowUp') {
      accordion = this.findPreviousAccordion(accordions, startingIndex);
    } else if (ev.key === 'Home') {
      accordion = accordions[0];
    } else if (ev.key === 'End') {
      accordion = accordions[accordions.length - 1];
    }

    if (accordion !== undefined && accordion !== activeElement) {
      accordion.focus();
    }
  }

  async componentDidLoad() {
    if (this.disabled) {
      this.disabledChanged();
    }
    if (this.readonly) {
      this.readonlyChanged();
    }
    /**
     * There's an issue when assigning a value to the accordion group
     * within the Angular primary content (rendering within the
     * app component template). When the template is isolated to a route,
     * the value is assigned correctly.
     * To address this issue, we need to ensure that the watcher is
     * called after the component has finished loading,
     * allowing the emit to be dispatched correctly.
     */
    this.valueChanged();
  }

  /**
   * Sets the value property and emits ionChange.
   * This should only be called when the user interacts
   * with the accordion and not for any update
   * to the value property. The exception is when
   * the app sets the value of a single-select
   * accordion group to an array.
   */
  private setValue(accordionValue: string | string[] | null | undefined) {
    const value = (this.value = accordionValue);
    this.ionChange.emit({ value });
  }

  /**
   * This method is used to ensure that the value
   * of ion-accordion-group is being set in a valid
   * way. This method should only be called in
   * response to a user generated action.
   * @internal
   */
  @Method()
  async requestAccordionToggle(accordionValue: string | undefined, accordionExpand: boolean) {
    const { multiple, value, readonly, disabled } = this;
    if (readonly || disabled) {
      return;
    }

    if (accordionExpand) {
      /**
       * If group accepts multiple values
       * check to see if value is already in
       * in values array. If not, add it
       * to the array.
       */
      if (multiple) {
        const groupValue = value ?? [];
        const processedValue = Array.isArray(groupValue) ? groupValue : [groupValue];
        const valueExists = processedValue.find((v) => v === accordionValue);
        if (valueExists === undefined && accordionValue !== undefined) {
          this.setValue([...processedValue, accordionValue]);
        }
      } else {
        this.setValue(accordionValue);
      }
    } else {
      /**
       * If collapsing accordion, either filter the value
       * out of the values array or unset the value.
       */
      if (multiple) {
        const groupValue = value ?? [];
        const processedValue = Array.isArray(groupValue) ? groupValue : [groupValue];
        this.setValue(processedValue.filter((v) => v !== accordionValue));
      } else {
        this.setValue(undefined);
      }
    }
  }

  private findNextAccordion(accordions: HTMLIonAccordionElement[], startingIndex: number) {
    const nextAccordion = accordions[startingIndex + 1];
    if (nextAccordion === undefined) {
      return accordions[0];
    }

    return nextAccordion;
  }

  private findPreviousAccordion(accordions: HTMLIonAccordionElement[], startingIndex: number) {
    const prevAccordion = accordions[startingIndex - 1];
    if (prevAccordion === undefined) {
      return accordions[accordions.length - 1];
    }

    return prevAccordion;
  }

  /**
   * @internal
   */
  @Method()
  async getAccordions() {
    return Array.from(this.el.querySelectorAll(':scope > ion-accordion')) as HTMLIonAccordionElement[];
  }

  render() {
    const { disabled, readonly, expand } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          [mode]: true,
          'accordion-group-disabled': disabled,
          'accordion-group-readonly': readonly,
          [`accordion-group-expand-${expand}`]: true,
        }}
        role="presentation"
      >
        <slot></slot>
      </Host>
    );
  }
}
