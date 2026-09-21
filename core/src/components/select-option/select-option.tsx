import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
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
   * If `true`, the user cannot interact with the select option.
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
   * visible effect on radio options in `popover` or `modal` on the `md`
   * and `ionic` themes (the radio control is hidden there).
   *
   * When unset, the interface picks a default based on theme and control
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
   * visible effect on radio options in `popover` or `modal` on the `md`
   * and `ionic` themes (the radio control is hidden there).
   *
   * When unset, the interface picks a default based on theme and control
   * type.
   */
  @Prop() justify?: 'start' | 'end' | 'space-between';

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
