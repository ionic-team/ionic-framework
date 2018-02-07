import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { THEME_VARIABLES }                                              from '../../theme-variables';
import { Color, ColorStep }                                             from '../Color';
import { COLOR_URL, getThemeUrl, STORED_THEME_KEY }                     from '../helpers';

interface ThemeVariable {
  property: string;
  value?: Color | number | string;
  computed?: string;
}

const PLACEHOLDER_COLOR = '#ff00ff';

@Component({
  tag: 'theme-selector',
  styleUrl: 'theme-selector.css'
})

export class ThemeSelector {

  @Element() el: HTMLThemeSelectorElement;
  @State() themeName: string;
  @State() themeVariables: ThemeVariable[] = [];
  @State() searchMode: boolean;
  @State() palettes: any[];
  @Prop() propertiesUsed: string[] = [];
  @Prop() themeData: { name: string }[];
  @Event() themeCssChange: EventEmitter;
  @Event() propertyHoverStart: EventEmitter;
  @Event() propertyHoverStop: EventEmitter;

  private currentHoveredProperty: string;

  async onChangeUrl (ev) {
    this.themeName = ev.currentTarget.value;
    localStorage.setItem(STORED_THEME_KEY, this.themeName);

    await this.loadThemeCss();
  }

  async componentWillLoad () {
    const storedThemeName = localStorage.getItem(STORED_THEME_KEY);
    const defaultThemeName = this.themeData[0].name;

    this.themeName = storedThemeName || defaultThemeName;

    await this.loadThemeCss();
  }

  async loadThemeCss () {
    console.log('ThemeSelector loadThemeCss');

    const themeUrl = getThemeUrl(this.themeName);

    const css = await fetch(themeUrl).then(r => r.text());
    this.parseCss(css);
    this.generateCss();
  }

  parseCss (css: string) {
    console.log('ThemeSelector parseCss');

    const themer = document.getElementById('themer') as HTMLStyleElement;
    themer.innerHTML = css;

    const computed = window.getComputedStyle(document.body);

    this.themeVariables = THEME_VARIABLES.map(themeVariable => {
      const value = (computed.getPropertyValue(themeVariable.property) || PLACEHOLDER_COLOR);

      return Object.assign({}, themeVariable, {
        property: themeVariable.property.trim(),
        value: themeVariable.computed ? value : (!Color.isColor(value) ? parseFloat(value) : new Color(value))
      });
    });
  }

  generateCss () {
    console.log('ThemeSelector generateCss', this.themeName);

    const c: string[] = [];
    c.push(`/** ${this.themeName} theme **/`);
    c.push(`\n`);
    c.push(':root {');

    this.themeVariables.forEach(themeVariable => {
      const value = themeVariable.value;
      c.push(`  ${themeVariable.property}: ${value instanceof Color ? value.hex : value};`);
    });

    c.push('}');

    const cssText = c.join('\n');
    this.themeCssChange.emit({
      cssText: cssText,
      themeName: this.themeName
    });
  }

  hoverProperty () {
    const targets: Element[] = Array.from(this.el.querySelectorAll(':hover')),
      selector: Element = targets.find(target => {
        return target.tagName.toLowerCase() === 'variable-selector';
      });

    if (selector) {
      const property = (selector as HTMLVariableSelectorElement).property;

      if (this.currentHoveredProperty !== property) {
        this.propertyHoverStop.emit({
          property: this.currentHoveredProperty
        });

        this.currentHoveredProperty = property;
        this.propertyHoverStart.emit({
          property: this.currentHoveredProperty
        });
      }
    }
  }

  @Listen('colorChange')
  onColorChange (ev) {
    console.log('ThemeSelector colorChange');
    this.changeColor(ev.detail.property, ev.detail.value);
  }

  changeColor (property: string, value: Color | string) {
    this.themeVariables = this.themeVariables.map(themeVariable => {
      if (property === themeVariable.property) {
        return Object.assign({}, themeVariable, {
          value: value instanceof Color ? value : themeVariable.value instanceof Color ? new Color(value) : value
        });
      }
      return themeVariable;
    });

    this.themeVariables
      .filter(themeVariable => !!themeVariable.computed)
      .forEach(themeVariable => {
        const computed = themeVariable.computed,
          referenceVariable = this.themeVariables.find(themeVariable => themeVariable.property === computed),
          value = referenceVariable.value;
        if (value instanceof Color) {
          themeVariable.value = value.toList();
        }
      });

    this.generateCss();
  }

  @Listen('generateColors')
  onGenerateColors (ev) {
    const color: Color = ev.detail.color,
      steps: Boolean = ev.detail.steps,
      property = ev.detail.property;

    if (color && property) {
      if (steps) {
        const steps: ColorStep[] = color.steps();
        steps.forEach((step: ColorStep) => {
          const themeVariable: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-step-${step.id}`);
          themeVariable && (themeVariable.value = step.color);
        });
      } else {
        const tint: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-tint`),
          shade: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-shade`),
          contrast: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-contrast`);

        tint && (tint.value = color.tint());
        shade && (shade.value = color.shade());
        contrast && (contrast.value = color.contrast());
      }

      this.generateCss();
      //TODO: Figure out why we need this typed to any
      (this.el as any).forceUpdate();
    }
  }

  @Listen('body:keydown')
  onKeyDown (ev: MouseEvent) {
    if (ev.ctrlKey) {
      this.hoverProperty();
    }
  }

  @Listen('body:keyup')
  onKeyUp (ev: KeyboardEvent) {
    if (this.currentHoveredProperty && !ev.ctrlKey) {
      this.propertyHoverStop.emit({
        property: this.currentHoveredProperty
      });
      this.currentHoveredProperty = null;
    }
  }

  @Listen('mousemove')
  onMouseMove (ev: MouseEvent) {
    if (ev.ctrlKey) {
      this.hoverProperty();
    }
  }

  onSearchInput (ev: KeyboardEvent) {
    if (ev.keyCode == 13) {
      this.search();
    }
  }

  toggleSearchMode () {
    this.searchMode = !this.searchMode;
  }

  async search () {
    const input: HTMLInputElement = this.el.querySelector('#searchInput') as HTMLInputElement,
      value = input.value;

    input.value = '';

    try {
      this.palettes = await fetch(`${COLOR_URL}?search=${value}&stuff=poop`).then(r => r.json()) || [];
    } catch (e) {
      this.palettes = [];
    }
  }

  onColorClick (ev: MouseEvent) {
    console.log(ev);
    let target: HTMLElement = ev.currentTarget as HTMLElement;
    const property = target.getAttribute('data-property');

    while (target && !target.classList.contains('color')) {
      target = target.parentElement as HTMLElement;
    }

    const color = target.getAttribute('data-color');
    this.changeColor(property, color);
  }

  render () {
    const
      onColorClick = this.onColorClick.bind(this),
      variables = <section>
        {
          this.themeVariables
            .filter(d => !d.computed)
            .map(d => <variable-selector class={this.propertiesUsed.indexOf(d.property) >= 0 ? 'used' : ''}
                                         property={d.property} value={d.value}></variable-selector>)
        }
      </section>,
      search = <section>
        <div>
          <input type="text" id="searchInput" onKeyUp={this.onSearchInput.bind(this)}/>
          <button class="search-button" onClick={this.search.bind(this)}>Search</button>
        </div>
        <div class="palettes">
          {
            (this.palettes || []).map((d: any) => <div class="palette" data-title={d.title}>
              {(d.colors || []).map((c: string) => <div class="color" data-color={`#${c}`}
                                                        style={{backgroundColor: `#${c}`}}>
                <div class="color-buttons">
                  <button onClick={onColorClick} data-property="--ion-color-primary" class="primary">p</button>
                  <button onClick={onColorClick} data-property="--ion-color-secondary" class="secondary">s</button>
                  <button onClick={onColorClick} data-property="--ion-color-tertiary" class="tertiary">t</button>
                  <button onClick={onColorClick} data-property="--ion-color-success" class="success">ss</button>
                  <button onClick={onColorClick} data-property="--ion-color-warning" class="warning">w</button>
                  <button onClick={onColorClick} data-property="--ion-color-danger" class="danger">d</button>
                  <button onClick={onColorClick} data-property="--ion-color-light" class="light">l</button>
                  <button onClick={onColorClick} data-property="--ion-color-medium" class="medium">m</button>
                  <button onClick={onColorClick} data-property="--ion-color-dark" class="dark">dk</button>
                  <button onClick={onColorClick} data-property="--ion-background-color" class="background">bg</button>
                  <button onClick={onColorClick} data-property="--ion-text-color" class="text">txt</button>
                </div>
              </div>)}
            </div>)
          }
        </div>

      </section>;

    return [
      <div>
        <div class="top-bar">
          <select onChange={this.onChangeUrl.bind(this)}>
            {this.themeData.map(d => <option value={d.name} selected={this.themeName === d.name}>{d.name}</option>)}
          </select>
          <button type="button" class="search-toggle"
                  onClick={this.toggleSearchMode.bind(this)}>{this.searchMode ? 'Close' : 'Open'} Search
          </button>
        </div>
        {this.searchMode ? search : variables}
      </div>
    ];
  }
};
