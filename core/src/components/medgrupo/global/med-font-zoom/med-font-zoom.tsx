import { Component, h, Host, Prop } from '@stencil/core';
import { RangeValue } from '../../../range/range-interface';

@Component({
  tag: 'med-font-zoom',
  styleUrl: 'med-font-zoom.scss',
  shadow: true,
})
export class MedFontZoom {
  @Prop() emitter!: {emit: (value: RangeValue) => void}

  onRangeChange = (event: RangeValue) => {
    if (this.emitter) {
      this.emitter.emit(event);
    }
  }

  render() {
    return (
      <Host from-stencil>
        <ion-range onIonChange={(ev) => this.onRangeChange(ev.detail.value)}>
          <ion-icon slot="start" size="small" name="med-font-decrease"></ion-icon>
          <ion-icon slot="end" name="med-font-increase"></ion-icon>
        </ion-range>
      </Host>
    );
  }

}
