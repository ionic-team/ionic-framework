import { Component } from '@stencil/core';


@Component({
  tag: 'ion-page',
})
export class Page {
  protected render() {
    return <slot></slot>;
  }
}
