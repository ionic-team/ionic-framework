import { Component, ComponentInterface, Element, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'ion-select-option'
})
export class SelectOption implements ComponentInterface {

  private inputId = `ion-selopt-${selectOptionIds++}`;

  @Element() el!: HTMLElement;

  /**
   * If true, the user cannot interact with the select option. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the element is selected.
   */
  @Prop() selected = false;

  /**
   * The text value of the option.
   */
  @Prop({ mutable: true }) value?: any;

  /**
   * Emitted when the select option loads.
   */
  @Event() ionSelectOptionDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the select option unloads.
   */
  @Event() ionSelectOptionDidUnload!: EventEmitter<void>;

  componentWillLoad() {
    if (this.value == null) {
      this.value = this.el.textContent || '';
    }
  }

  componentDidLoad() {
    this.ionSelectOptionDidLoad.emit();
  }

  componentDidUnload() {
    this.ionSelectOptionDidUnload.emit();
  }

  hostData() {
    return {
      'role': 'option',
      'id': this.inputId
    };
  }
}

let selectOptionIds = 0;
