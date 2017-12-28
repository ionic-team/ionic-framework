import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { isValidColorValue } from '../helpers';


@Component({
  tag: 'color-selector',
  styleUrl: 'color-selector.css',
  shadow: true
})
export class ColorSelector {

  @Prop() property: string;
  @Prop({ mutable: true }) value: string;
  @Prop() isRgb: boolean;
  isValid: boolean;

  onChange(ev) {
    if (this.isRgb) {
      this.value = hexToRgb(ev.currentTarget.value);
    } else {
      this.value = ev.currentTarget.value;
    }

    this.colorChange.emit({
      property: this.property,
      value: this.value
    });
  }

  @Event() colorChange: EventEmitter;

  render() {
    const value = this.value.trim().toLowerCase();
    const hex = rgbToHex(value);

    return [
      <section class={isValidColorValue(value) ? 'valid' : 'invalid'}>
        <div class='color-square'>
          <input type='color' value={hex} onInput={this.onChange.bind(this)} tabindex='-1' />
        </div>
        <div class='color-value'>
          <input type='text' value={value} onInput={this.onChange.bind(this)} />
        </div>
        <div class='property-label'>
          {this.property}
        </div>
      </section>
    ];
  }
}

function rgbToHex(value: string) {
  if (value.indexOf('rgb') === -1) {
    return value;
  }

  var c = value.replace(/[\sa-z\(\);]+/gi, '').split(',');
  c = c.map(s => parseInt(s, 10).toString(16).replace(/^([a-z\d])$/i, '0$1'));

  return '#' + c[0] + c[1] + c[2];
}

function hexToRgb(c: any) {
  if (c.indexOf('#') === -1) {
    return c;
  }
  c = c.replace(/#/, '');
  c = c.length % 6 ? c.replace(/(.)(.)(.)/, '$1$1$2$2$3$3') : c;
  c = parseInt(c, 16);

  var a = parseFloat(a) || null;

  const r = (c >> 16) & 255;
  const g = (c >> 8) & 255;
  const b = (c >> 0) & 255;

  return `rgb${a ? 'a' : ''}(${[r, g, b, a].join().replace(/,$/, '')})`;
}
