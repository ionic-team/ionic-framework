import { Component, Host, h, Prop } from '@stencil/core';
import { Color, Neutral } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';
import { MedChartRadiaItem } from '../med-chart-radial/med-chart-radial-interface';

@Component({
  tag: 'med-chart-radial-label',
  styleUrl: 'med-chart-radial-label.scss',
  scoped: true
})
export class MedChartRadialLabel {
  @Prop({reflect: true}) valores: MedChartRadiaItem[] = [];

  /**
   * Define a cor do componente.
   */
  @Prop() color?: Color;

  /**
   * Define a cor neutra do componente.
   */
  @Prop() neutral?: Neutral;

  render() {
    const { color, neutral } = this;

    return (
      <Host from-stencil
        class={createColorClasses(color, {
          'med-chart-radial-label': true,
        }, neutral)}
      >
        <ul class="med-chart-radial-label__list">
          {
            this.valores.reverse().map((item: MedChartRadiaItem) => {
              return <li class="med-chart-radial-label__item"><span class={{'med-chart-radial-label__quantia': true, [item.cor]: true}}>{item.quantia}</span> {item.label}</li>
            })
          }
        </ul>
      </Host>
    );
  }

}
