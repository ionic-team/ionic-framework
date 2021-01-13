import { Component, ComponentInterface, Event, EventEmitter, Host, Method, Prop, Watch, h } from '@stencil/core';
import { AccordionGroupChangeEventDetail } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-accordion-group',
  shadow: true
})
export class AccordionGroup implements ComponentInterface {

  /**
   * If `true`, the accordion group can have multiple
   * accordion components expanded at the same time.
   */
  @Prop() multiple?: boolean;

  /**
   * The value of the accordion group.
   */
  @Prop({ mutable: true }) value?: string | string[] | null;

  /**
   * If `true`, the accordion group cannot be interacted with.
   */
  @Prop() disabled = false;

  /**
   * Describes the expansion behavior for each accordion.
   * Possible values are `"float"`, `"inset"`, `"accordion"`,
   * and `"popout"`. Defaults to `"float"`.
   */
  @Prop() expand: 'float' | 'inset' | 'accordion' | 'popout' = 'float';

  /**
   * Emitted when the value property has changed.
   */
  @Event() ionChange!: EventEmitter<AccordionGroupChangeEventDetail>;

  @Watch('value')
  valueChanged() {
    this.ionChange.emit({ value: this.value });
  }

  /**
   * @internal
   */
  @Method()
  async requestAccordionToggle(accordionValue: string | undefined, accordionExpand: boolean) {
    const { multiple, value } = this;

    if (accordionExpand) {
      /**
       * If group accepts multiple values
       * check to see if value is already in
       * in values array. If not, add it
       * to the array.
       */
      if (multiple) {
        const groupValue = (value || []) as string[];
        const valueExists = groupValue.find(v => v === accordionValue);
        if (!valueExists && accordionValue !== undefined) {
          this.value = [...groupValue, accordionValue];
        }
      /**
       * If group does not accept multiple
       * values, just set the value.
       */
      } else {
        this.value = accordionValue;
      }
    } else {
      /**
       * If collapsing accordion, either filter the value
       * out of the values array or unset the value.
       */
      if (multiple) {
        const groupValue = (value || []) as string[];
        this.value = groupValue.filter(v => v !== accordionValue);
      } else {
        this.value = undefined;
      }
    }
  }

  render() {

    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
