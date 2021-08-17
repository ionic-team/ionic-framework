import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-list-header',
  styleUrls: {
    ios: 'list-header.ios.scss',
    md: 'list-header.md.scss'
  },
  shadow: true
})
export class ListHeader implements ComponentInterface {

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * How the bottom border should be displayed on the list header.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  render() {
    const { lines } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          [`list-header-lines-${lines}`]: lines !== undefined,
        }
        )}
      >
        <div class="list-header-inner">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
