import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'chart-donut',
  styleUrl: 'chart-donut.css',
  shadow: true,
})
export class ChartDonut {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
