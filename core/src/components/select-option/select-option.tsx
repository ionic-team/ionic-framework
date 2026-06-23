import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the select option text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the select option text in LTR, and to the left in RTL.
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

  /**
   * Where the label is placed relative to the option's selection control
   * (radio circle or checkbox box) when the option is rendered in an
   * `alert`, `popover`, or `modal` interface.
   * `"start"`: The label will appear to the left of the radio in LTR and to the right in RTL.
   * `"end"`: The label will appear to the right of the radio in LTR and to the left in RTL.
   *
   * Applies to the `alert`, `popover`, and `modal` interfaces, but has no
   * visible effect on radio options in `popover` or `modal` on `md` (the radio control is hidden there).
   *
   * When unset, the interface picks a default based on mode and control
   * type.
   */
  @Prop() labelPlacement?: 'start' | 'end';

  /**
   * How to pack the label and the option's selection control within a line.
   * `"start"`: The label and radio will appear on the left in LTR and
   * on the right in RTL.
   * `"end"`: The label and radio will appear on the right in LTR and
   * on the left in RTL.
   * `"space-between"`: The label and radio will appear on opposite
   * ends of the line with space between the two elements.
   *
   * Applies to the `alert`, `popover`, and `modal` interfaces, but has no
   * visible effect on radio options in `popover` or `modal` on `md` (the radio control is hidden there).
   *
   * When unset, the interface picks a default based on mode and control
   * type.
   */
  @Prop() justify?: 'start' | 'end' | 'space-between';

  render() {
    return <Host role="option" id={this.inputId} class={getIonMode(this)}></Host>;
  }
}

let selectOptionIds = 0;
