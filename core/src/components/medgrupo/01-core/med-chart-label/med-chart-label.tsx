import { Component, Host, h, Prop } from '@stencil/core';

export interface MedDonutItem {
  cor: string;
  label: string;
  quantia: number;
  ignoreBarra: boolean;
};

@Component({
  tag: 'med-chart-label',
  styleUrl: 'med-chart-label.scss',
  scoped: true
})
export class MedChartLabel {
  @Prop({reflect: true}) valores: MedDonutItem[] = [];

  render() {
    return (
      <Host>
        <ul class="list">
          {
            this.valores.map((item: MedDonutItem) => {
              return <li class="item"><span class={{'quantia': true, [item.cor]: true}}>{item.quantia}</span> {item.label}</li>
            })
          }
        </ul>
      </Host>
    );
  }

}
