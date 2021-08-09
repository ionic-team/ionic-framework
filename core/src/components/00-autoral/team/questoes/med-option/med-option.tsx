import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-option',
  styleUrl: 'med-option.scss',
  shadow: {
    delegatesFocus: true
  }
})
export class MedOption {
  render() {
    return (
      <Host from-stencil>
        <div class="option">
          <slot></slot>
          <slot name="label"></slot>
        </div>
      </Host>
    );
  }
}
