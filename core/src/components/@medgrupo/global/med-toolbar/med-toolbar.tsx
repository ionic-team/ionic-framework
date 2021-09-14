import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-toolbar',
  styleUrl: 'med-toolbar.scss',
  shadow: true,
})
export class MedToolbar {
   /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  render() {
    const { dsColor} = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-toolbar': true,
        })}>
        <div class="container">
          <slot name="start"></slot>
          <div class="container__center">
            <slot></slot>
          </div>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }

}
