import { Component, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';


@Component({
  tag: 'ion-select-option',
  host: {
    theme: 'select-option'
  }
})
export class SelectOption {
  @Element() el: HTMLElement;

  @Event() ionSelect: EventEmitter;

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Prop() disabled: boolean = false;

  /**
   * @input {boolean} If true, the element is selected.
   */
  @Prop({ mutable: true }) selected: boolean = false;

  /**
   * @input {string} The text value of the option.
   */
  @Prop() value: string;

  @Method()
  getText(): string {
    return this.el.textContent || '';
  }

  protected render() {
    return <slot></slot>;
  }

}
