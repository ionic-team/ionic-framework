import { Component, Element, Event, EventEmitter, Prop } from '@stencil/core';


@Component({
  tag: 'ion-select-option',
  host: {
    theme: 'select-option'
  }
})
export class SelectOption {
  id: string;

  @Element() el: HTMLElement;

  /**
   * If true, the user cannot interact with the select option.
   */
  @Prop() disabled = false;

  /**
   * If true, the element is selected.
   */
  @Prop({ mutable: true }) selected = false;

  /**
   * The text value of the option.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Emitted when the select option loads.
   */
  @Event() ionSelectOptionDidLoad: EventEmitter;

  /**
   * Emitted when the select option unloads.
   */
  @Event() ionSelectOptionDidUnload: EventEmitter;

  constructor() {
    this.id = 'ion-selopt-' + (selectOptionIds++);
  }

  componentWillLoad() {
    this.value = this.value || this.el.textContent;
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
      'id': this.id
    };
  }

  render() {
    return <slot></slot>;
  }

}


export interface HTMLIonSelectOptionElementEvent extends CustomEvent {
  target: HTMLIonSelectOptionElement;
}

let selectOptionIds = 0;
