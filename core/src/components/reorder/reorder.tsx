import { Component, ComponentInterface, Listen, Prop } from '@stencil/core';

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

  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

  mode!: Mode;

  @Listen('click', { capture: true })
  onClick(ev: Event) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  render() {
    return (
      <slot>
        <ion-icon name="reorder" lazy={false} class="reorder-icon"></ion-icon>
      </slot>
    );
  }

}
