import { Component, ComponentInterface, Host, Listen, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @part icon - The icon of the reorder handle.
 */
@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
  },
  shadow: true
})
export class Reorder implements ComponentInterface {

  @Listen('click', { capture: true })
  onClick(ev: Event) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  render() {
    const mode = getIonMode(this);
    const reorderIcon = mode === 'ios' ? 'reorder-three-outline' : 'reorder-two-sharp';
    return (
      <Host class={mode}>
        <slot>
          <ion-icon name={reorderIcon} lazy={false} class="reorder-icon" part="icon" />
        </slot>
      </Host>
    );
  }

}
