import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-select-option',
  shadow: true,
  styleUrl: 'select-option.scss',
})
export class SelectOption implements ComponentInterface {
  private inputId = `ion-selopt-${selectOptionIds++}`;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the user cannot interact with the select option. This property does not apply when `interface="action-sheet"` as `ion-action-sheet` does not allow for disabled buttons.
   */
  @Prop() disabled = false;

  /**
   * The text value of the option.
   */
  @Prop() value?: any | null;

  render() {
    return <Host role="option" id={this.inputId} class={getIonMode(this)}></Host>;
  }
}

let selectOptionIds = 0;
