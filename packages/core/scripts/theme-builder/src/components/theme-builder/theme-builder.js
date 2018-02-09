var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import {Component, Listen, State} from '@stencil/core';
import {DATA_URL, STORED_DEMO_MODE_KEY, STORED_DEMO_URL_KEY} from '../helpers';

let ThemeBuilder = class ThemeBuilder {
  constructor () {
    this.cssText = '';
    this.themeName = '';
  }

  componentWillLoad () {
    return fetch(DATA_URL).then(rsp => {
      return rsp.json().then(data => {
        this.demoData = data.demos;
        this.themeData = data.themes;
        this.initUrl();
      });
    }).catch(err => {
      console.log('ThemeBuilder componentWillLoad', err);
    });
  }

  initUrl () {
    console.log('ThemeBuilder initUrl');
    const storedUrl = localStorage.getItem(STORED_DEMO_URL_KEY);
    const defaultUrl = this.demoData[0].url;
    this.demoUrl = storedUrl || defaultUrl;
    const storedMode = localStorage.getItem(STORED_DEMO_MODE_KEY);
    const defaultMode = 'md';
    this.demoMode = storedMode || defaultMode;
  }

  onDemoUrlChange (ev) {
    this.demoUrl = ev.detail;
    localStorage.setItem(STORED_DEMO_URL_KEY, this.demoUrl);
  }

  onDemoModeChange (ev) {
    this.demoMode = ev.detail;
    localStorage.setItem(STORED_DEMO_MODE_KEY, this.demoMode);
  }

  onThemeCssChange (ev) {
    this.cssText = ev.detail.cssText;
    this.themeName = ev.detail.themeName;
    console.log('ThemeBuilder themeCssChange', this.themeName);
  }

  render () {
    return [
      h("main", null,
        h("section", {class: 'preview-column'},
          h("demo-selection", {demoData: this.demoData, demoUrl: this.demoUrl, demoMode: this.demoMode}),
          h("app-preview", {demoUrl: this.demoUrl, demoMode: this.demoMode, cssText: this.cssText})),
        h("section", {class: 'selector-column'},
          h("theme-selector", {themeData: this.themeData})),
        h("section", null,
          h("css-text", {themeName: this.themeName, cssText: this.cssText})))
    ];
  }
};
__decorate([
  State()
], ThemeBuilder.prototype, "demoUrl", void 0);
__decorate([
  State()
], ThemeBuilder.prototype, "demoMode", void 0);
__decorate([
  State()
], ThemeBuilder.prototype, "cssText", void 0);
__decorate([
  State()
], ThemeBuilder.prototype, "themeName", void 0);
__decorate([
  Listen('demoUrlChange')
], ThemeBuilder.prototype, "onDemoUrlChange", null);
__decorate([
  Listen('demoModeChange')
], ThemeBuilder.prototype, "onDemoModeChange", null);
__decorate([
  Listen('themeCssChange')
], ThemeBuilder.prototype, "onThemeCssChange", null);
ThemeBuilder = __decorate([
  Component({
    tag: 'theme-builder',
    styleUrl: 'theme-builder.css',
    shadow: true
  })
], ThemeBuilder);
export {ThemeBuilder};
