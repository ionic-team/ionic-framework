import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

const progressBarValue: any = {
  'weak': {
    value: 0.2,
  },
  'medium': {
    value: 0.6,
  },
  'strong': {
    value: 1,
  }
}

@Component({
  tag: 'ion-password-strength',
  shadow: true
})
export class PasswordStrength implements ComponentInterface {
  @Prop() strength?: 'weak' | 'medium' | 'strong';

  render() {
    // TODO need a mode virtual prop
    // TODO need to add colors
    const data = this.strength !== undefined ? progressBarValue[this.strength] : undefined;
    return (
      <Host>
        <ion-progress-bar value={data?.value || 0}></ion-progress-bar>
        { this.strength !== undefined && <slot name={this.strength}></slot> }
      </Host>
    );
  }
}
