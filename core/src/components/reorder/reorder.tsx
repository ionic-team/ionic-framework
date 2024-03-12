import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, h } from '@stencil/core';
import { reorderThreeOutline, reorderTwoSharp } from 'ionicons/icons';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @part icon - The icon of the reorder handle (uses ion-icon).
 */
@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
    ionic: 'reorder.md.scss',
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
    const theme = getIonTheme(this);
    const reorderIcon = theme === 'ios' ? reorderThreeOutline : reorderTwoSharp;
    return (
      <Host
        class={{
          [theme]: true,
        }}
      >
        <slot>
          <ion-icon icon={reorderIcon} lazy={false} class="reorder-icon" part="icon" aria-hidden="true" />
        </slot>
      </Host>
    );
  }
}
