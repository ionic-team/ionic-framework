import { Component, Host, h, Prop, Method } from '@stencil/core';
import { Color, Neutral } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-agrupador',
  styleUrl: 'med-agrupador.scss',
  shadow: true,
})
export class MedAgrupador {

  /**
   * Define a cor do componente.
   */
  @Prop() color?: Color;

  /**
   * Define a cor neutra do componente.
   */
  @Prop() neutral?: Neutral;

  /**
   * Define o estado do componente.
   */
   @Prop({ reflect: true, mutable: true }) collapsed = true;

   @Method()
   async toggle(event?: Event) {
     event?.stopPropagation();
     this.collapsed = !this.collapsed;
   }

  render() {
    const { color, neutral, collapsed } = this;

    return (
      <Host from-stencil
        class={createColorClasses(color, {
          'med-agrupador': true,
          'med-agrupador--collapsed': collapsed
        }, neutral)}
        onClick={(event: any) => {this.toggle(event)}}>
        <div class="med-agrupador__expandir">Expandir a lista</div>
        <div class="med-agrupador__ocultar">Ocultar a lista</div>
        <ion-icon class="med-icon med-agrupador__icon" name="med-baixo"></ion-icon>
      </Host>
    );
  }

}
