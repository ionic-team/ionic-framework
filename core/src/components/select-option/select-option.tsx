import { Component, ComponentInterface, Element, Event, EventEmitter, Prop } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-select-option',
  shadow: true,
  styleUrl: 'select-option.scss'
})
export class SelectOption implements ComponentInterface {
  mode!: Mode;

  private inputId = `ion-selopt-${selectOptionIds++}`;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the user cannot interact with the select option.
   */
  @Prop() disabled = false;

  /**
   * If `true`, the element is selected.
   */
  @Prop() selected = false;

  /**
   * The text value of the option.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * Emitted when the select option loads.
   * @internal
   */
  @Event() ionSelectOptionDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the select option unloads.
   * @internal
   */
  @Event() ionSelectOptionDidUnload!: EventEmitter<void>;

  componentWillLoad() {
    if (this.value === undefined) {
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
      'id': this.inputId,
      class: {
        [`${this.mode}`]: true,
      }
    };
  }
}

let selectOptionIds = 0;
