import { Component, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row implements ComponentInterface {
  render() {
    return <slot></slot>;
  }
}
