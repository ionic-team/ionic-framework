import { Component } from '@stencil/core';


@Component({
  tag: 'ion-page',
})
export class Page {
  render() {
    return <slot></slot>;
  }
}
