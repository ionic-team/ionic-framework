import { Component, Host, h, Prop } from '@stencil/core';

export interface MedDonutItem {
  cor: string;
  label: string;
  quantia: number;
  ignoreBarra: boolean;
};

@Component({
  tag: 'med-chart-donut',
  styleUrl: 'med-chart-donut.scss',
  scoped: true
})
export class MedChartDonut {
  @Prop({reflect: true}) valores: MedDonutItem[] = [];

  private getTotal() {
    const totais = {
      total: 0,
      subtotais: [] as number[]
    }

    this.valores.forEach((item: MedDonutItem) => {
      totais.total += item.quantia;
      totais.subtotais.push(totais.total);
    })

    return totais;
  }

  render() {
    const totais = this.getTotal();

    return (
      <Host>
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" />
          {
            this.valores.reverse().map((item: MedDonutItem, index: number) => {
              const subtotalIndex = this.valores.length - index - 1;

              if (!item.ignoreBarra) {
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
