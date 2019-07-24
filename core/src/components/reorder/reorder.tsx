import { Component, ComponentInterface, Listen, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

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

  hostData() {
    return {
      class: getIonMode(this)
    };
  }

  render() {
    return (
      <slot>
        <ion-icon name="reorder" lazy={false} class="reorder-icon" />
      </slot>
    );
  }

}
