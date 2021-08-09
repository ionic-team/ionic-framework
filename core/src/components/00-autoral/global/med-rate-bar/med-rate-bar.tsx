import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-rate-bar',
  styleUrl: 'med-rate-bar.scss',
  shadow: true,
})
export class MedRateBar {

  render() {
    return (
      <Host from-stencil>
        <slot></slot>
        <slot name="avaliacao"></slot>
      </Host>
    );
  }

}
