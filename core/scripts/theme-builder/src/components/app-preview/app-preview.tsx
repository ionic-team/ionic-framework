import { Component, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';
import { Color }                                               from '../Color';


@Component({
  tag: 'app-preview',
  styleUrl: 'app-preview.css',
  shadow: true
})
export class AppPreview {

  @Prop() cssText: string;
  @Prop() demoMode: string;
  @Prop() demoUrl: string;
  hasIframeListener: boolean = false;
  @Prop() hoverProperty: string;
  iframe: HTMLIFrameElement;
  @Event() propertiesUsed!: EventEmitter;

  applyStyles () {
    if (this.iframe && this.iframe.contentDocument && this.iframe.contentDocument.documentElement) {
      const iframeDoc = this.iframe.contentDocument;
      const themerStyleId = 'themer-style';

      let themerStyle: HTMLStyleElement = iframeDoc.getElementById(themerStyleId) as any;
      if (!themerStyle) {
        themerStyle = iframeDoc.createElement('style');
        themerStyle.id = themerStyleId;
        iframeDoc.documentElement.appendChild(themerStyle);

        const applicationStyle = iframeDoc.createElement('style');
        iframeDoc.documentElement.appendChild(applicationStyle);
        applicationStyle.innerHTML = 'html.theme-property-searching body * { pointer-events: auto !important}';
      }

      themerStyle.innerHTML = this.cssText;
    }
  }

  @Watch('cssText')
  onCssTextChange () {
    console.log('AppPreview onCssTextChange');

    this.applyStyles();
  }

  @Watch('hoverProperty')
  onHoverPropertyChange () {
    const el = this.iframe.contentDocument.documentElement;
    el.style.cssText = '';
    if (this.hoverProperty) {
      const computed = window.getComputedStyle(el),
        value = computed.getPropertyValue(this.hoverProperty);

      if (Color.isColor(value)) {
        el.style.setProperty(this.hoverProperty, '#ff0000');
      } else {
        el.style.setProperty(this.hoverProperty, parseFloat(value) > .5 ? '.1' : '1');
      }
    }
  }

  onIframeLoad () {
    this.applyStyles();

    this.iframe.contentDocument.documentElement.addEventListener('mousemove', this.onIframeMouseMove.bind(this));
  }

  onIframeMouseMove (ev) {
    if (ev.ctrlKey) {
      const el: HTMLElement = this.iframe.contentDocument.documentElement;

      if (!el.classList.contains('theme-property-searching')) {
        el.classList.add('theme-property-searching');
      }
      const sheets = (this.iframe.contentDocument.styleSheets),
        items: Element[] = Array.from(ev.currentTarget.querySelectorAll(':hover')),
        properties = [];

      items.forEach(item => {
        for (let i in sheets) {
          const sheet: CSSStyleSheet = sheets[i] as CSSStyleSheet,
            rules = sheet.rules || sheet.cssRules;
          for (let r in rules) {
            const rule: CSSStyleRule = rules[r] as CSSStyleRule;
            if (item.matches(rule.selectorText)) {
              const matches = rule.cssText.match(/(--ion.+?),/mgi);
              if (matches) {
                properties.push(...matches.map(match => match.replace(',', '')));
              }
            }
          }
        }
      });

      this.propertiesUsed.emit({
        properties: Array.from(new Set(properties)).filter(prop => !/(-ios-|-md-)/.test(prop))
      });
    }
  }

  @Listen('body:keyup', {capture: true})
  onKeyUp (ev: KeyboardEvent) {
    if (ev.keyCode === 17) {
      const el: HTMLElement = this.iframe.contentDocument.documentElement;
      el.classList.remove('theme-property-searching');

      this.propertiesUsed.emit({
        properties: []
      });
    }
  }

  render () {
    const url = `${this.demoUrl}?ionic:mode=${this.demoMode}`;

    return [
      <div>
        <iframe src={url} ref={el => this.iframe = el as any} onLoad={this.onIframeLoad.bind(this)}></iframe>
      </div>
    ];
  }
}
