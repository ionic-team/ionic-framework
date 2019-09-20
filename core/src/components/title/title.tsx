import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, StyleEventDetail } from '../../interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-title',
  styleUrl: 'title.scss',
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

  private getMode() {
    const mode = getIonMode(this);
    const toolbar = this.el.closest('ion-toolbar');
    return (toolbar && toolbar.mode) || mode;
  }

  render() {
    const mode = this.getMode();
    const size = this.getSize();

    return (
      <Host
        class={{
          [mode]: true,
          [`title-${mode}`]: true,
          [`title-${size}`]: true,

          ...createColorClasses(this.color),
        }}
      >
        <div class="toolbar-title">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
