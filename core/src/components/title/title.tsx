import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color, StyleEventDetail } from '../../interface';

@Component({
  tag: 'ion-title',
  styleUrls: {
    ios: 'title.ios.scss',
    md: 'title.md.scss',
  },
  shadow: true,
})
export class ToolbarTitle implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * The size of the toolbar title.
   */
  @Prop() size?: 'large' | 'small';

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('size')
  protected sizeChanged() {
    this.emitStyle();
  }

  connectedCallback() {
    this.emitStyle();
  }

  private emitStyle() {
    const size = this.getSize();

    this.ionStyle.emit({
      [`title-${size}`]: true,
    });
  }

  private getSize() {
    return this.size !== undefined ? this.size : 'default';
  }

  render() {
    const theme = getIonTheme(this);
    const size = this.getSize();

    return (
      <Host
        class={createColorClasses(this.color, {
          [theme]: true,
          [`title-${size}`]: true,
          'title-rtl': document.dir === 'rtl',
        })}
      >
        <div class="toolbar-title">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
