import { Component, Prop, PropDidChange } from '@stencil/core';


@Component({
  tag: 'app-preview',
  styleUrl: 'app-preview.css',
  shadow: true
})
export class AppPreview {

  @Prop() demoUrl: string;
  @Prop() demoMode: string;
  @Prop() cssText: string;
  iframe: HTMLIFrameElement;

  @PropDidChange('cssText')
  onCssTextChange() {
    console.log('AppPreview onCssTextChange');

    this.applyStyles();
  }

  applyStyles() {
    if (this.iframe && this.iframe.contentDocument && this.iframe.contentDocument.documentElement) {
      const iframeDoc = this.iframe.contentDocument;
      const themerStyleId = 'themer-style';

      let themerStyle: HTMLStyleElement = iframeDoc.getElementById(themerStyleId) as any;
      if (!themerStyle) {
        themerStyle = iframeDoc.createElement('style');
        themerStyle.id = themerStyleId;
        iframeDoc.documentElement.appendChild(themerStyle);
      }

      themerStyle.innerHTML = this.cssText;
    }
  }

  onIframeLoad() {
    this.applyStyles();
  }

  render() {
    const url = `${this.demoUrl}?ionicplatform=${this.demoMode}`;

    return [
      <div>
        <iframe src={url} ref={elm => this.iframe = elm as any} onLoad={this.onIframeLoad.bind(this)}></iframe>
      </div>
    ];
  }
}
