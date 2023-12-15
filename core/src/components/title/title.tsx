import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, Watch, h } from '@stencil/core';
import { doc } from '@utils/browser';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
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
    const { el } = this;
    const mode = getIonMode(this);
    const size = this.getSize();

    /**
     * If there is already a level one heading
     * within the context of the page then
     * do not add another one.
     */
    const root = el.closest('.ion-page') ?? doc?.body;
    const hasHeading = root?.querySelector('h1, [role="heading"][aria-level="1"]');
    const hasRole = el.hasAttribute('role');

    /**
     * The first `ion-title` on the page is considered
     * the heading. This can be customized by setting
     * role="heading" aria-level="1" on another element
     * or by using h1.
     *
     * Level 1 headings must be contained inside of a landmark,
     * so we check for ion-header which is typically the landmark.
     */
    const isHeading =
      hasRole === false && hasHeading === null && root?.querySelector('ion-title') === el && el?.closest('ion-header[role]') !== null;
    return (
      <Host
        role={isHeading ? 'heading' : null}
        aria-level={isHeading ? '1' : null}
        class={createColorClasses(this.color, {
          [mode]: true,
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
