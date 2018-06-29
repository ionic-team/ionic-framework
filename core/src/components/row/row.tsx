import { Component } from '@stencil/core';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row {
  render() {
    return <slot></slot>;
  }
}
