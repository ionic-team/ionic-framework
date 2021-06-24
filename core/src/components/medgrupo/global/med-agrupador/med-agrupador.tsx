import { Component, Host, h, Prop } from '@stencil/core';
import { Color } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-agrupador',
  styleUrl: 'med-agrupador.scss',
  shadow: true,
})
export class MedAgrupador {

  @Prop() color?: Color;

  render() {
    const {color} = this;
    return (
      <Host class={createColorClasses(color, {null:true})}>
        <div class="toggle__expandir">Expandir a lista</div>
        <div class="toggle__ocultar">Ocultar a lista</div>
        <ion-icon class="toggle__img" name="med-arrow-down"></ion-icon>
      </Host>
    );
  }

}
