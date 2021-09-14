import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';
import { MedColor } from '../../../../interface';

@Component({
  tag: 'med-list',
  styleUrl: 'med-list.scss',
  shadow: true,
})
export class MedList {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * TODO
   */
  @Prop() margin?: 'xs' | 'sm' | 'md' | 'lg';

  render() {
    const { dsColor, margin } = this;
    return (
      <Host
        from-stencil
        class={createColorClasses(dsColor, {
          'med-list': true,
          [`med-list--${margin}`]: margin !== undefined
        })}>
        <slot></slot>
      </Host>
    );
  }

}
