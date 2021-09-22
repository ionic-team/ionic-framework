import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';
import { MedChartRadiaItem } from '../med-chart-radial/med-chart-radial-interface';

@Component({
  tag: 'med-chart-radial-label',
  styleUrl: 'med-chart-radial-label.scss',
  scoped: true
})
export class MedChartRadialLabel {
  /**
   * TODO
   */
  @Prop({reflect: true}) valores: MedChartRadiaItem[] = [];

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * Define a variação de tamanho do componente.
   */
  @Prop() dsSize?: 'lg';

  render() {
    const { dsColor, dsSize } = this;

    //const arrayReverse = this.valores.slice(0).reverse();

    return (
      <Host from-stencil
        class={generateMedColor(dsColor, {
          'med-chart-radial-label': true,
          [`med-chart-radial-label--${dsSize}`]: dsSize !== undefined,
        })}
      >
        <ul class="med-chart-radial-label__list">
          {
            this.valores.map((item: MedChartRadiaItem) => {
              return <li class="med-chart-radial-label__item"><span class={{'med-chart-radial-label__quantia': true, [item.cor]: true}}>{item.quantia}</span> {item.label}</li>
            })
          }
        </ul>
      </Host>
    );
  }

}
