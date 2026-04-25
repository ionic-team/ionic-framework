import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the item text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the item text in LTR, and to the left in RTL.
 */
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

  /**
   * Text that is placed underneath the option text to provide additional details about the option.
   */
  @Prop() description?: string;

  render() {
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
        }}
        role="option"
        id={this.inputId}
      ></Host>
    );
  }
}

let selectOptionIds = 0;
