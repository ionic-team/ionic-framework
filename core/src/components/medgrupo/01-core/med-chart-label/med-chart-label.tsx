import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-chart-label',
  styleUrl: 'med-chart-label.css',
  shadow: true,
})
export class MedChartLabel {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
