import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-chart-radial-content',
  styleUrl: 'med-chart-radial-content.scss',
  shadow: true,
})
export class MedChartRadialContent {
  @Prop({reflect: true}) total = 0;

  componentDidRender() {
    this.fontResize();
  }

  @Watch('total')
  collapsedChanged() {
    this.fontResize();
  }
  private fontResize() {
    if (this.total.toString().length >= 6) {
      return 'med-chart-radial-content__number--small';
    }

    return '';
  }

  render() {
    const { total } = this;

    return (
      <Host from-stencil
        class={createColorClasses(null, {
          'med-chart-radial-content': true,
        }, null)}>
        <span class="med-chart-radial-content__label">Total de</span>
        <span class={`med-chart-radial-content__number ${this.fontResize()}`}>{total}</span>
        <span class="med-chart-radial-content__label">Questões</span>
      </Host>
    );
  }

}
