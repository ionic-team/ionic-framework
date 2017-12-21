import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { STORED_THEME_KEY, THEME_VARIABLES, getThemeUrl } from '../../theme-variables';


@Component({
  tag: 'theme-selector',
  styleUrl: 'theme-selector.css',
  shadow: true
})
export class ThemeSelector {

  @State() themeName: string;
  @State() themeVariables: { property: string; value?: string; isRgb?: boolean; }[] = [];
  @Prop() themeData: { name: string }[];
  @Event() themeCssChange: EventEmitter;


  onChangeUrl(ev) {
    this.themeName = ev.currentTarget.value;
    localStorage.setItem(STORED_THEME_KEY, this.themeName);

    this.loadThemeCss();
  }

  componentWillLoad() {
    const storedThemeName = localStorage.getItem(STORED_THEME_KEY);
    const defaultThemeName = this.themeData[0].name;

    this.themeName = storedThemeName || defaultThemeName;

    this.loadThemeCss();
  }

  loadThemeCss() {
    console.log('ThemeSelector loadThemeCss');

    const themeUrl = getThemeUrl(this.themeName);

    return fetch(themeUrl).then(rsp => {
      return rsp.text().then(css => {
        this.parseCss(css);
        this.generateCss();
      });
    });
  }

  parseCss(css: string) {
    console.log('ThemeSelector parseCss');

    const themer = document.getElementById('themer') as HTMLStyleElement;
    themer.innerHTML = css;

    const computed = window.getComputedStyle(document.body);

    this.themeVariables = THEME_VARIABLES.map(themeVariable => {
      const value = (computed.getPropertyValue(themeVariable.property) || '#eeeeee').trim().toLowerCase();
      return {
        property: themeVariable.property.trim(),
        value: value,
        isRgb: value.indexOf('rgb') > -1
      };
    });
  }

  generateCss() {
    console.log('ThemeSelector generateCss', this.themeName);

    const c: string[] = [];
    c.push(`/** ${this.themeName} theme **/`);
    c.push(`\n`);
    c.push(':root {');

    this.themeVariables.forEach(themeVariable => {
      themeVariable.value = (themeVariable.value || '').trim();
      c.push(`  ${themeVariable.property}: ${themeVariable.value};`);
    });

    c.push('}');

    const cssText = c.join('\n');
    this.themeCssChange.emit({
      cssText: cssText,
      themeName: this.themeName
    });
  }

  @Listen('colorChange')
  onColorChange(ev) {
    console.log('ThemeSelector colorChange');

    this.themeVariables = this.themeVariables.map(themeVariable => {
      let value = themeVariable.value;

      if (ev.detail.property === themeVariable.property) {
        value = ev.detail.value;
      }

      return {
        property: themeVariable.property,
        value: value,
        isRgb: themeVariable.isRgb
      };
    });

    this.generateCss();
  }

  render() {
    return [
      <div>
        <select onChange={this.onChangeUrl.bind(this)}>
          {this.themeData.map(d => <option value={d.name} selected={this.themeName === d.name}>{d.name}</option>)}
        </select>

        <section>
          {this.themeVariables.map(d => <color-selector property={d.property} value={d.value} isRgb={d.isRgb}></color-selector>)}
        </section>
      </div>
    ];
  }
}
