import { Component, ComponentInterface, Listen, getMode, h } from '@stencil/core';

import { Mode } from '../../interface';

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
    const mode = getMode<Mode>(this);
    return {
      class: {
        [`${mode}`]: true,
      }
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
