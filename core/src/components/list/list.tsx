import type { ComponentInterface } from '@stencil/core';
import {
  Component,
  Element,
  Host,
  Method,
  Prop,
  h,
} from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss',
  },
})
export class List
  implements ComponentInterface
{
  @Element() el!: HTMLElement;

  /**
   * How the bottom border should be displayed on all items.
   */
  @Prop() lines?:
    | 'full'
    | 'inset'
    | 'none';

  /**
   * If `true`, the list will have margin around it and rounded corners.
   */
  @Prop() inset = false;

  /**
   * If `ion-item-sliding` are used inside the list, this method closes
   * any open sliding item.
   *
   * Returns `true` if an actual `ion-item-sliding` is closed.
   */
  @Method()
  async closeSlidingItems(): Promise<boolean> {
    const item = this.el.querySelector(
      'ion-item-sliding'
    );
    if (item?.closeOpened) {
      return item.closeOpened();
    }
    return false;
  }

  render() {
    const mode = getIonMode(this);
    const { lines, inset } = this;
    return (
      <Host
        role="list"
        class={{
          [mode]: true,

          // Used internally for styling
          [`list-${mode}`]: true,

          'list-inset': inset,
          [`list-lines-${lines}`]:
            lines !== undefined,
          [`list-${mode}-lines-${lines}`]:
            lines !== undefined,
        }}
      ></Host>
    );
  }
}
