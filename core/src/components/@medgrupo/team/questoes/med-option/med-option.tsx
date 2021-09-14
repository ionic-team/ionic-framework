import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../../interface';
import { generateMedColor } from '../../../../../utils/med-theme';

@Component({
  tag: 'med-option',
  styleUrl: 'med-option.scss',
  shadow: {
    delegatesFocus: true
  }
})
export class MedOption {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  render() {

    const { dsColor } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-badge': true,
        })}>
        <div class="option">
          <slot></slot>
          <slot name="label"></slot>
        </div>
      </Host>
    );
  }
}
