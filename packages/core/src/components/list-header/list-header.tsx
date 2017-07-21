import { Component } from '@stencil/core';


@Component({
  tag: 'ion-list-header',
  host: {
    theme: 'list-header'
  }
})
export class ListHeader {
  render() {
    return <slot></slot>;
  }
}
