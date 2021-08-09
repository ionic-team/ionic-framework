import { Component, Host, h, Prop } from '@stencil/core';
import { MedChartRadiaItem } from './med-chart-radial-interface';

@Component({
  tag: 'med-chart-radial',
  styleUrl: 'med-chart-radial.scss',
  scoped: true
})
export class MedChartRadial {
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

    return (
      <Host from-stencil>
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
      </Host>
    );
  }

}
