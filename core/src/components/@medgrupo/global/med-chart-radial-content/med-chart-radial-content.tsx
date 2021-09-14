import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-chart-radial-content',
  styleUrl: 'med-chart-radial-content.scss',
  shadow: true,
})
export class MedChartRadialContent {
  /**
   * TODO
   */
  @Prop({reflect: true}) total = 0;

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

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
    const { total, dsColor } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-chart-radial-content': true,
        })}>
        <span class="med-chart-radial-content__label">Total de</span>
        <span class={`med-chart-radial-content__number ${this.fontResize()}`}>{total}</span>
        <span class="med-chart-radial-content__label">Questões</span>
      </Host>
    );
  }

}
