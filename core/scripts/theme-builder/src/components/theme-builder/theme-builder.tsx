import { Component, Listen, State }                            from '@stencil/core';
import { DATA_URL, STORED_DEMO_MODE_KEY, STORED_DEMO_URL_KEY } from '../helpers';


@Component({
  tag: 'theme-builder',
  styleUrl: 'theme-builder.css',
  shadow: true
})
export class ThemeBuilder {

  @State() cssText = '';
  demoData: { name: string, url: string }[];
  @State() demoMode: string;
  @State() demoUrl: string;
  @State() hoverProperty: string;
  @State() propertiesUsed: string[];
  themeData: { name: string }[];
  @State() themeName = '';

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

  @Listen('demoModeChange')
  onDemoModeChange (ev) {
    this.demoMode = ev.detail;
    localStorage.setItem(STORED_DEMO_MODE_KEY, this.demoMode);
  }

  @Listen('demoUrlChange')
  onDemoUrlChange (ev) {
    this.demoUrl = ev.detail;
    localStorage.setItem(STORED_DEMO_URL_KEY, this.demoUrl);
  }

  @Listen('propertiesUsed')
  onPropertiesUsed (ev) {
    this.propertiesUsed = ev.detail.properties;
  }

  @Listen('propertyHoverStart')
  onPropertyHoverStart (ev) {
    this.hoverProperty = ev.detail.property;
  }

  @Listen('propertyHoverStop')
  onPropertyHoverStop () {
    this.hoverProperty = undefined;
  }

  @Listen('themeCssChange')
  onThemeCssChange (ev) {
    this.cssText = ev.detail.cssText;
    this.themeName = ev.detail.themeName;

    console.log('ThemeBuilder themeCssChange', this.themeName);
  }

  render () {
    return [
      <main>
        <section class="preview-column">
          <demo-selection demoData={this.demoData} demoUrl={this.demoUrl} demoMode={this.demoMode}></demo-selection>
          <app-preview demoUrl={this.demoUrl} demoMode={this.demoMode} cssText={this.cssText}
                       hoverProperty={this.hoverProperty}></app-preview>
        </section>

        <section class="selector-column">
          <theme-selector themeData={this.themeData} propertiesUsed={this.propertiesUsed}></theme-selector>
        </section>

        <section>
          <css-text themeName={this.themeName} cssText={this.cssText}></css-text>
        </section>

      </main>
    ];
  }

}
