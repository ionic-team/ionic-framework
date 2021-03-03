import { Component, Host, h } from '@stencil/core';
@Component({
  tag: 'med-button',
  styleUrls: {
    ios: './med-button.scss',
    md: './med-button.scss'
  },
  shadow: true,
})
export class MedButton {
  render() {
    return (
      <Host>
        <h1>MED-BUTTON</h1>
      </Host>
    );
  }
}
