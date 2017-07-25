import { Component } from '@stencil/core';


@Component({
  tag: 'ion-header',
  host: {
    theme: 'header'
  }
})
export class Header {
  render() {
    return <slot></slot>;
  }
}
