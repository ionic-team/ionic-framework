import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, h } from '@stencil/core';
import { reorderThreeOutline, reorderTwoSharp } from 'ionicons/icons';

import { getIonStylesheet } from '../../global/ionic-global';

/**
 * @virtualProp {true | false} useBase - useBase determines if base components is enabled.
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part icon - The icon of the reorder handle (uses ion-icon).
 */
@Component({
  tag: 'ion-reorder',
  styleUrls: {
    base: 'reorder.scss',
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
  },
  shadow: true,
})
export class Reorder implements ComponentInterface {
  @Element() el!: HTMLIonReorderElement;

  @Listen('click', { capture: true })
  onClick(ev: Event) {
    const reorderGroup = this.el.closest('ion-reorder-group');

    ev.preventDefault();

    // Only stop event propagation if the reorder is inside of an enabled
    // reorder group. This allows interaction with clickable children components.
    if (!reorderGroup || !reorderGroup.disabled) {
      ev.stopImmediatePropagation();
    }
  }

  render() {
    const mode = getIonStylesheet(this);
    const reorderIcon = mode === 'ios' ? reorderThreeOutline : reorderTwoSharp;
    return (
      <Host class={mode}>
        <slot>
          <ion-icon icon={reorderIcon} lazy={false} class="reorder-icon" part="icon" />
        </slot>
      </Host>
    );
  }
}
