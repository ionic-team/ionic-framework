import { Component, ComponentInterface, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';
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

  /**
   * @internal
   */
  @Method()
  async requestAccordionToggle(accordionValue: string | undefined, accordionExpand: boolean) {
    const { multiple, value } = this;

    if (!accordionExpand) {
      this.value = value.filter(v => v !== accordionValue);
    } else {
      const isArray = Array.isArray(value);
      if (isArray) {

      } else {
        this.value = accordionValue;
      }
    }
    console.log('requested accordion toggle', value, expanded, this.value);
  }

  render() {

    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
