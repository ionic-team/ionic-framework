var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import {Component, Event, Listen, Prop, State} from '@stencil/core';
import {THEME_VARIABLES} from '../../theme-variables';
import * as Helpers from '../helpers';

console.log(Helpers);
let ThemeSelector = class ThemeSelector {
  constructor () {
    this.themeVariables = [];
  }

  onChangeUrl (ev) {
    this.themeName = ev.currentTarget.value;
    localStorage.setItem(Helpers.STORED_THEME_KEY, this.themeName);
    this.loadThemeCss();
  }

  componentWillLoad () {
    const storedThemeName = localStorage.getItem(Helpers.STORED_THEME_KEY);
    const defaultThemeName = this.themeData[0].name;
    this.themeName = storedThemeName || defaultThemeName;
    this.loadThemeCss();
  }

  loadThemeCss () {
    console.log('ThemeSelector loadThemeCss');
    const themeUrl = Helpers.getThemeUrl(this.themeName);
    return fetch(themeUrl).then(rsp => {
      return rsp.text().then(css => {
        this.parseCss(css);
        this.generateCss();
      });
    });
  }

  parseCss (css) {
    console.log('ThemeSelector parseCss');
    const themer = document.getElementById('themer');
    themer.innerHTML = css;
    const computed = window.getComputedStyle(document.body);
    this.themeVariables = THEME_VARIABLES.map(themeVariable => {
      const value = (computed.getPropertyValue(themeVariable.property) || PLACEHOLDER_COLOR);
      return {
        property: themeVariable.property.trim(),
        value: value,
        type: themeVariable.type,
        computed: themeVariable.computed,
        isRgb: value.indexOf('rgb') > -1
      };
    });
  }

  generateCss () {
    console.log('ThemeSelector generateCss', this.themeName);
    const c = [];
    c.push(`/** ${this.themeName} theme **/`);
    c.push(`\n`);
    c.push(':root {');
    this.themeVariables.forEach(themeVariable => {
      themeVariable.value = Helpers.cleanCssValue(themeVariable.value);
      c.push(`  ${themeVariable.property}: ${themeVariable.value};`);
    });
    c.push('}');
    const cssText = c.join('\n');
    this.themeCssChange.emit({
      cssText: cssText,
      themeName: this.themeName
    });
  }

  onColorChange (ev) {
    console.log('ThemeSelector colorChange');
    this.themeVariables = this.themeVariables.map(themeVariable => {
      let value = themeVariable.value;
      if (ev.detail.property === themeVariable.property) {
        value = ev.detail.value;
      }
      return {
        property: themeVariable.property,
        value: value,
        type: themeVariable.type,
        computed: themeVariable.computed,
        isRgb: themeVariable.isRgb
      };
    });
    this.themeVariables
      .filter(themeVariable => !!themeVariable.computed)
      .forEach(themeVariable => {
        const computed = themeVariable.computed || {}, fn = computed.fn, params = computed.params;
        if (Helpers[fn]) {
          themeVariable.value = Helpers[fn].apply(fn, params);
        }
        else {
          console.log(`Unknown Helpers Function '${fn}'`);
        }
      });
    this.generateCss();
  }

  render () {
    return [
      h("div", null,
        h("select", {onChange: this.onChangeUrl.bind(this)}, this.themeData.map(d => h("option", {
          value: d.name,
          selected: this.themeName === d.name
        }, d.name))),
        h("section", null, this.themeVariables
          .filter(d => !d.computed)
          .map(d => h("variable-selector", {property: d.property, value: d.value, isRgb: d.isRgb, type: d.type}))))
    ];
  }
};
__decorate([
  State()
], ThemeSelector.prototype, "themeName", void 0);
__decorate([
  State()
], ThemeSelector.prototype, "themeVariables", void 0);
__decorate([
  Prop()
], ThemeSelector.prototype, "themeData", void 0);
__decorate([
  Event()
], ThemeSelector.prototype, "themeCssChange", void 0);
__decorate([
  Listen('colorChange')
], ThemeSelector.prototype, "onColorChange", null);
ThemeSelector = __decorate([
  Component({
    tag: 'theme-selector',
    styleUrl: 'theme-selector.css',
    shadow: true
  })
], ThemeSelector);
export {ThemeSelector};
const PLACEHOLDER_COLOR = `#ff00ff`;
