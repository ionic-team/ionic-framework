import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Color }                                                         from '../Color';


@Component({
  tag: 'variable-selector',
  styleUrl: 'variable-selector.css',
  shadow: true
})
export class VariableSelector {

  @Element() el: HTMLElement;
  @Prop() property: string;
  @Prop() type: 'color' | 'percent';
  @Prop({mutable: true}) value: Color | string | number;
  @Prop() isRgb: boolean;
  @Event() colorChange: EventEmitter;
  @Event() generateColors: EventEmitter;

  @Method()
  getProperty () {
    return this.property;
  }

  onChange (ev) {
    const input: HTMLInputElement = ev.currentTarget,
      value = ev.currentTarget.value;

    if (input.type === 'color') {
      this.value = new Color(value);
    } else if (input.type === 'text') {
      if (Color.isColor(value)) {
        this.value = new Color(value);
      } else {
        return;
      }
    } else if (input.type === 'range') {
      this.value = value / 100;
    }

    this.colorChange.emit({
      property: this.property,
      value: this.value
    });
  }


  @Listen('dblclick')
  onMouseUp (ev) {
    if (ev.altKey) {
      const color = this.value as Color;
      if (/(primary|secondary|tertiary|success|warning|danger|light|medium|dark)$/.test(this.property)) {
        this.generateColors.emit({
          color,
          property: this.property
        });
      } else if (/(^--ion-background-color$|^--ion-text-color$)/.test(this.property)) {
        this.generateColors.emit({
          color,
          steps: true,
          property: this.property
        });
      }
    }
  }

  render () {
    if (this.value instanceof Color || this.value == null) {
      const color = this.value && this.value as Color,
        value = color.hex, {r, g, b} = color.rgb;
      this.el.style.setProperty('--variable-selector-color', `rgba(${r}, ${g}, ${b}, .5`);
      return [
        <section class={value ? 'valid' : 'invalid'}>
          <div class="color-square">
            <input type="color" value={value} onInput={this.onChange.bind(this)} tabindex="-1"/>
          </div>
          <div class="color-value">
            <input type="text" value={value} onChange={this.onChange.bind(this)}/>
          </div>
          <div class="property-label">
            {this.property}
          </div>
        </section>
      ];
    }
    const value = parseFloat(this.value as string);
    return [
      <section>
        <div class="property-value">
          <input type="range" value={value * 100} min="0" max="100" step="1" onInput={this.onChange.bind(this)}/>
        </div>
        <div class="property-label">
          {this.property}
        </div>
      </section>
    ];
  }
}
