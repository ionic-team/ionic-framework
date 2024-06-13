import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Method, Prop, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss',
    ionic: 'list.ionic.scss',
  },
})
export class List implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * How the bottom border should be displayed on all items.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  /**
   * If `true`, the list will have margin around it and rounded corners.
   */
  @Prop() inset = false;

  /**
   * If inset is `true`, then the corners can be changed.
   *
   * Set to `"soft"` for slightly rounded corners,
   * `"round"` for fully rounded corners,
   * or `"rectangular"` for no rounded corners.
   *
   * Defaults to `"round"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  /**
   * If `ion-item-sliding` are used inside the list, this method closes
   * any open sliding item.
   *
   * Returns `true` if an actual `ion-item-sliding` is closed.
   */
  @Method()
  async closeSlidingItems(): Promise<boolean> {
    const item = this.el.querySelector('ion-item-sliding');
    if (item?.closeOpened) {
      return item.closeOpened();
    }
    return false;
  }

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-): Remove theme check when shapes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (shape === undefined) {
      return 'round';
    }

    return shape;
  }

  render() {
    const theme = getIonTheme(this);
    const shape = this.getShape();
    const { lines, inset } = this;

    return (
      <Host
        role="list"
        class={{
          [theme]: true,

          // Used internally for styling
          [`list-${theme}`]: true,
          'list-inset': inset,
          [`list-lines-${lines}`]: lines !== undefined,
          [`list-${theme}-lines-${lines}`]: lines !== undefined,
          [`list-${shape}`]: shape !== undefined,
        }}
      ></Host>
    );
  }
}
