import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'med-divider',
  styleUrl: 'med-divider.scss',
  shadow: true,
})
export class MedDivider {
  @Prop() text!: string;

  render() {
    return (
      <Host>
        <h4 class="heading">{this.text}</h4>
      </Host>
    );
  }

}
