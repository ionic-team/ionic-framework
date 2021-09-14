import { Component, Host, h, Prop, Method } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-agrupador',
  styleUrl: 'med-agrupador.scss',
  shadow: true,
})
export class MedAgrupador {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * Define o estado do componente.
   */
   @Prop({ reflect: true, mutable: true }) collapsed = true;

   /**
   * TODO
   */
   @Method()
   async toggle(event?: Event) {
     event?.stopPropagation();
     this.collapsed = !this.collapsed;
   }

  render() {
    const { dsColor, collapsed } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-agrupador': true,
          'med-agrupador--collapsed': collapsed
        })}
        onClick={(event: any) => {this.toggle(event)}}>
        <div class="med-agrupador__expandir">Expandir a lista</div>
        <div class="med-agrupador__ocultar">Ocultar a lista</div>
        <ion-icon class="med-icon med-agrupador__icon" name="med-baixo"></ion-icon>
      </Host>
    );
  }

}

