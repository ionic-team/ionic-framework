import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, StyleEventDetail } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-title',
  styleUrls: {
    'ios': 'title.ios.scss',
    'md': 'title.md.scss'
  },
  shadow: true
})
export class ToolbarTitle implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

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
      [`title-${size}`]: true
    });
  }

  private getSize() {
    return (this.size !== undefined) ? this.size : 'default';
  }

  render() {
    const mode = getIonMode(this);
    const size = this.getSize();

    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
          [`title-${size}`]: true,
        })}
      >
        <div class="toolbar-title">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
