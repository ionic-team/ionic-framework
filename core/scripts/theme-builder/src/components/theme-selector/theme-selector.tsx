import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { ComputedType, THEME_VARIABLES, ThemeVariable }                 from '../../theme-variables';
import { Color }                                                        from '../Color';
import { COLOR_URL, getThemeUrl, STORED_THEME_KEY }                     from '../helpers';

const PLACEHOLDER_COLOR = '#ff00ff';

enum DefaultCSSDuplicateMode {
  inherit = 'inherit',
  ignore = 'ignore',
  bake = 'bake'
}

@Component({
  tag: 'theme-selector',
  styleUrl: 'theme-selector.css'
})

export class ThemeSelector {
  @Element() el!: HTMLThemeSelectorElement;
  @State() generateContrast: boolean = false;
  @State() generateSteps: boolean = true;
  @State() generateVariations: boolean = true;
  @State() palettes: any[];
  @Prop() propertiesUsed: string[] = [];
  @Event() propertyHoverStart!: EventEmitter;
  @Event() propertyHoverStop!: EventEmitter;
  @State() searchMode: boolean;
  @State() showSteps: boolean = true;
  @Event() themeCssChange!: EventEmitter;
  @Prop() themeData: { name: string }[];
  @State() themeName: string;
  @State() themeVariables: ThemeVariable[] = [];
  private currentHoveredProperty: string;
  private cssHolder: HTMLStyleElement;
  private proxyElement: HTMLElement;
  private defaultCSSDuplicateMode: DefaultCSSDuplicateMode = DefaultCSSDuplicateMode.bake;

  changeColor (property: string, value: Color | string) {
    this.themeVariables = this.themeVariables.map(themeVariable => {
      if (property === themeVariable.property) {
        return Object.assign({}, themeVariable, {
          value: value instanceof Color ? value : themeVariable.value instanceof Color ? new Color(value) : value
        });
      }
      return themeVariable;
    });

    this.updateComputed(property);
    this.generateCss();
  }

  async componentDidLoad () {
    const storedThemeName = localStorage.getItem(STORED_THEME_KEY);
    const defaultThemeName = this.themeData[0].name;

    this.cssHolder = document.createElement('style');
    this.el.insertBefore(this.cssHolder, this.el.firstChild);

    this.themeName = storedThemeName || defaultThemeName;

    await this.loadThemeCss();
  }

  async generateCss () {
    console.log('ThemeSelector generateCss', this.themeName);

    const defaultThemeURL = getThemeUrl('default'),
      defaultCSS: string = this.themeName === 'default' ? '' : await fetch(defaultThemeURL).then(r => r.text()),
      c: string[] = [];

    c.push(`/** ${this.themeName} theme **/`);
    c.push(`\n`);
    c.push(':root {');

    this.themeVariables.forEach(themeVariable => {
      const variableValue = themeVariable.value,
        value = variableValue instanceof Color ? variableValue.hex : variableValue,
        match = defaultCSS.match(`(${themeVariable.property}): ?(.*);`);

      let matchValue: string | number = match && match[2];
      if (matchValue && !matchValue.match(/,|#/)) matchValue = parseFloat(matchValue);

      if (this.defaultCSSDuplicateMode === DefaultCSSDuplicateMode.bake || matchValue !== value) {
        c.push(`  ${themeVariable.property}: ${value};`);
      } else {
        if (this.defaultCSSDuplicateMode === DefaultCSSDuplicateMode.inherit) {
          c.push(`  ${themeVariable.property}: inherit;`);
        }
      }

      this.el.style.setProperty(themeVariable.property, value.toString());
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

  isVariableDependentOn (property: string, variable: ThemeVariable) {
    const params = (variable.computed && variable.computed && variable.computed.params) || {};
    if (!property) return true;
    return (variable.property === property || params.from === property || params.property === property);
  }

  async loadThemeCss () {
    console.log('ThemeSelector loadThemeCss');

    const themeUrl = getThemeUrl(this.themeName);

    const css = await fetch(themeUrl).then(r => r.text());
    this.parseCss(css);
    this.generateCss();
  }

  async onChangeUrl (ev) {
    this.themeName = ev.currentTarget.value;
    localStorage.setItem(STORED_THEME_KEY, this.themeName);

    await this.loadThemeCss();
  }


  async onDefaultCSSDuplicateChange (mode: DefaultCSSDuplicateMode) {
    this.defaultCSSDuplicateMode = mode;
    await this.generateCss();
  }

  @Listen('colorChange')
  onColorChange (ev) {
    console.log('ThemeSelector colorChange');
    this.changeColor(ev.detail.property, ev.detail.value);
  }

  onColorClick (ev: MouseEvent) {
    let target: HTMLElement = ev.currentTarget as HTMLElement;
    const property = target.getAttribute('data-property');

    while (target && !target.classList.contains('color')) {
      target = target.parentElement as HTMLElement;
    }

    const color = target.getAttribute('data-color');
    this.changeColor(property, color.toLowerCase());
  }

  @Listen('generateColors')
  onGenerateColors (ev) {
    const color: Color = ev.detail.color,
      steps: Boolean = ev.detail.steps,
      property = ev.detail.property;

    if (color && property) {
      if (steps) {
        this.themeVariables.filter((variable: ThemeVariable) => {
          const type: ComputedType = variable.computed && variable.computed.type,
            params = (variable.computed && variable.computed.params) || {};

          if (type === ComputedType.step && params.property === property) {
            return variable;
          }
        }).forEach((variable: ThemeVariable) => {
          const params: any = variable.computed.params || {},
            stepFromVariable: ThemeVariable = this.themeVariables.find(themeVariable => themeVariable.property === params.from),
            stepFromValue = stepFromVariable && stepFromVariable.value;

          if (stepFromValue instanceof Color) {
            variable.value = color.mix(stepFromValue, params.amount);
          }
        });
      } else {
        this.updateVariations(property, color);
      }

      this.generateCss();
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

  parseCss (css: string) {
    console.log('ThemeSelector parseCss');

    this.cssHolder.innerHTML = css.replace(':root', `#${this.proxyElement.id}`);
    const computed = window.getComputedStyle(this.proxyElement);

    this.themeVariables = THEME_VARIABLES.map(themeVariable => {
      const value = (computed.getPropertyValue(themeVariable.property) || PLACEHOLDER_COLOR),
        type: string = (themeVariable.computed && themeVariable.computed.type) || (!Color.isColor(value) ? 'percent' : 'color');

      return Object.assign({}, themeVariable, {
        property: themeVariable.property.trim(),
        value: type === 'color' || type === ComputedType.step ? new Color(value) : type === 'percent' ? parseFloat(value) : value
      });
    });
  }

  render () {
    const
      onColorClick = this.onColorClick.bind(this),
      variables = <section>
        {
          this.themeVariables
            .filter(d => !(d.computed && (d.computed.type === ComputedType.rgblist || (d.computed.type === ComputedType.step && !this.showSteps))))
            .map(d => {
              const computedReferences: ComputedType[] = this.themeVariables
                .filter(variable => variable.computed && variable.computed.params && variable.computed.params.property === d.property)
                .map(variable => variable.computed.type);

              return <variable-selector
                class={{'is-primary': !!computedReferences.length, used: this.propertiesUsed.indexOf(d.property) >= 0}}
                property={d.property} value={d.value}
                usedWith={Array.from(new Set(computedReferences))}/>;
            })
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
                  {this.themeVariables
                    .filter(variable => !!variable.quickPick)
                    .map(variable => <button onClick={onColorClick}
                                             data-property={variable.property}
                                             style={{backgroundColor: `var(${variable.property})`}}>{variable.quickPick.text}</button>)
                  }
                </div>
              </div>)}
            </div>)
          }
        </div>

      </section>;

    return [
      <div id="css-proxy" ref={el => this.proxyElement = el}/>,
      <div>
        <div class="top-bar">
          <select onChange={this.onChangeUrl.bind(this)}>
            {this.themeData.map(d => <option value={d.name} selected={this.themeName === d.name}>{d.name}</option>)}
          </select>
          <div class="right">
            <button type="button" class="search-toggle"
                    onClick={this.toggleSearchMode.bind(this)}>{this.searchMode ? 'Close' : 'Open'} Search
            </button>
            <div class="settings">
              <div class="row">
                <div class="checkbox">
                  <input type="checkbox" id="generateContrast" checked={this.generateContrast}
                         onChange={this.toggleCheck.bind(this, 'generateContrast')}/>
                  <label>Auto Contrast</label>
                </div>
                <div class="checkbox">
                  <input type="checkbox" id="generateVariations" checked={this.generateVariations}
                         onChange={this.toggleCheck.bind(this, 'generateVariations')}/>
                  <label>Auto Shade/Tint</label>
                </div>
              </div>
              <div class="row">
                <div class="checkbox">
                  <input type="checkbox" id="generateSteps" checked={this.generateSteps}
                         onChange={this.toggleCheck.bind(this, 'generateSteps')}/>
                  <label>Auto Steps</label>
                </div>
                <div class="checkbox">
                  <input type="checkbox" id="showSteps" checked={this.showSteps}
                         onChange={this.toggleCheck.bind(this, 'showSteps')}/>
                  <label>Show Steps</label>
                </div>
              </div>
              <div class="row">
                <div class="radio-group">
                  <label>Default Duplication Mode: </label>
                  <div class="radio">
                    <input name="radio-default-css-duplicate" type="radio"
                           onChange={this.onDefaultCSSDuplicateChange.bind(this, DefaultCSSDuplicateMode.inherit)}/>
                    <label>inherit</label>
                  </div>

                  <div class="radio">
                    <input name="radio-default-css-duplicate" type="radio"
                           onChange={this.onDefaultCSSDuplicateChange.bind(this, DefaultCSSDuplicateMode.ignore)}/>
                    <label>ignore</label>
                  </div>

                  <div class="radio">
                    <input name="radio-default-css-duplicate" type="radio" checked
                           onChange={this.onDefaultCSSDuplicateChange.bind(this, DefaultCSSDuplicateMode.bake)}/>
                    <label>bake</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.searchMode ? search : variables}
      </div>
    ];
  }

  async search () {
    const input: HTMLInputElement = this.el.querySelector('#searchInput') as HTMLInputElement,
      value = input.value;

    input.value = '';

    try {
      this.palettes = await fetch(`${COLOR_URL}?search=${value}`).then(r => r.json()) || [];
    } catch (e) {
      this.palettes = [];
    }
  }

  toggleCheck (param: string, ev: Event) {
    this[param] = (ev.target as HTMLInputElement).checked;
  }

  toggleSearchMode () {
    this.searchMode = !this.searchMode;
  }

  updateComputed (property?: string) {
    this.themeVariables
      .filter(themeVariable => !!themeVariable.computed && this.isVariableDependentOn(property, themeVariable))
      .forEach(themeVariable => {
        const computed = themeVariable.computed,
          type: ComputedType = computed.type,
          params = computed.params || {};

        if (type === ComputedType.rgblist) {
          const referenceVariable: ThemeVariable = this.themeVariables.find(themeVariable => themeVariable.property === params.property),
            value = referenceVariable && referenceVariable.value;

          if (value instanceof Color) {
            themeVariable.value = value.toList();
          }
        } else if (this.generateSteps && type === ComputedType.step) {
          const referenceVariable: ThemeVariable = this.themeVariables.find(themeVariable => themeVariable.property === params.property),
            stepFromVariable: ThemeVariable = this.themeVariables.find(themeVariable => themeVariable.property === params.from),
            referenceValue = referenceVariable && referenceVariable.value,
            fromValue = stepFromVariable && stepFromVariable.value;

          if (referenceValue instanceof Color && (typeof(fromValue) === 'string' || fromValue instanceof Color)) {
            themeVariable.value = referenceValue.mix(fromValue, params.amount);
          }
        }
      });

    if (this.generateVariations) {
      this.themeVariables
        .filter(themeVariable => !themeVariable.computed && this.isVariableDependentOn(property, themeVariable))
        .forEach(themeVariable => {
          const property: string = themeVariable.property,
            color: Color = themeVariable.value as Color;
          this.updateVariations(property, color);
        });
    }
  }

  updateVariations (property: string, color: Color) {
    const tint: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-tint`),
      shade: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-shade`);

    tint && (tint.value = color.tint());
    shade && (shade.value = color.shade());

    if (this.generateContrast) {
      const contrast: ThemeVariable = this.themeVariables.find((variable: ThemeVariable) => variable.property === `${property}-contrast`);
      contrast && (contrast.value = color.contrast());
    }
  }
}
