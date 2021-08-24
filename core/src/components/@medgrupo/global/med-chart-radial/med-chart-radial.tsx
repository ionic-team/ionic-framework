import { Component, Host, h, Prop } from '@stencil/core';
import { MedChartRadiaItem } from './med-chart-radial-interface';
import { createColorClasses } from '../../../../utils/theme';
import { Color } from '../../../../interface';

@Component({
  tag: 'med-chart-radial',
  styleUrl: 'med-chart-radial.scss',
  scoped: true
})
export class MedChartRadial {

  /**

   */
   @Prop() color?: Color;

  /**
   * Define a variação do componente.
   */
  @Prop() dsName?: string;

  @Prop({reflect: true}) valores: MedChartRadiaItem[] = [];

  private getTotal() {
    const totais = {
      total: 0,
      subtotais: [] as number[]
    }

    this.valores.forEach((item: MedChartRadiaItem) => {
      totais.total += item.quantia;
      totais.subtotais.push(totais.total);
    })

    return totais;
  }

  render() {
    const totais = this.getTotal();
    const { dsName, color } = this;

    return (
      <Host from-stencil
        class={createColorClasses(color, {
          'med-chart-radial': true,
          [`med-chart-radial--${dsName}`]: dsName !== undefined,
        }, null)}>
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" />
          {
            this.valores.reverse().map((item: MedChartRadiaItem, index: number) => {
              const subtotalIndex = this.valores.length - index - 1;

              if (!item.ignoreBarra && item.quantia !== 0) {
                return <circle cx="18" cy="18" r="16"
                  class={{'size': true, [item.cor]: true}}
                  style={{
                    '--size': `${(totais.subtotais[subtotalIndex] / totais.total) * 100}`,
                  }}
                />;
              }
            })
          }
        </svg>
        {dsName === "simple" && <div class="med-chart-radial__percent">10%</div>}
      </Host>
    );
  }

}
