import { Component, Host, h, Prop, State } from '@stencil/core';
import { Color } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-agrupador',
  styleUrl: 'med-agrupador.scss',
  shadow: true,
})
export class MedAgrupador {

  @Prop() color?: Color;
  @State() toggle = false;
  onClick = () => {
    this.toggle = this.toggle ? !this.toggle : !this.toggle
  }

  render() {
    const {color} = this;
    return (
      <Host from-stencil class={createColorClasses(color, {null:true,'toggle': this.toggle})} onClick={this.onClick}>
        <div class="toggle__expandir">Expandir a lista</div>
        <div class="toggle__ocultar">Ocultar a lista</div>
        <ion-icon class="toggle__img" name="med-arrow-down"></ion-icon>
      </Host>
    );
  }

}
