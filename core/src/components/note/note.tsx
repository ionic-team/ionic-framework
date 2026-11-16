import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { config } from '../../global/config';
import type { Color } from '../../interface';
import type { Hue } from '../../themes/themes.interfaces';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-note',
  styleUrl: 'note.scss',
  shadow: true,
})
export class Note implements ComponentInterface {
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"bold"` for a note with vibrant, bold colors or to `"subtle"` for
   * a note with muted, subtle colors.
   *
   * Defaults to `"bold"` if both the hue property and theme config are unset.
   */
  @Prop() hue?: Hue;

  /**
   * Gets the note hue. Uses the `hue` property if set, otherwise
   * checks the theme config and falls back to 'bold' if neither is provided.
   */
  get hueValue(): Hue {
    const hueConfig = config.getObjectValue('IonNote.hue', 'bold') as Hue;

    return this.hue || hueConfig;
  }

  render() {
    const { color, hueValue } = this;

    return (
      <Host
        class={createColorClasses(color, {
          [`note-hue-${hueValue}`]: true,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
