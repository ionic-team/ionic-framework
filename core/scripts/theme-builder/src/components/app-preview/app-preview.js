var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import {Component, Prop, Watch} from '@stencil/core';

let AppPreview = class AppPreview {
  onCssTextChange () {
    console.log('AppPreview onCssTextChange');
    this.applyStyles();
  }

  applyStyles () {
    if (this.iframe && this.iframe.contentDocument && this.iframe.contentDocument.documentElement) {
      const iframeDoc = this.iframe.contentDocument;
      const themerStyleId = 'themer-style';
      let themerStyle = iframeDoc.getElementById(themerStyleId);
      if (!themerStyle) {
        themerStyle = iframeDoc.createElement('style');
        themerStyle.id = themerStyleId;
        iframeDoc.documentElement.appendChild(themerStyle);
      }
      themerStyle.innerHTML = this.cssText;
    }
  }

  onIframeLoad () {
    this.applyStyles();
  }

  render () {
    const url = `${this.demoUrl}?ionic:mode=${this.demoMode}`;
    return [
      h("div", null,
        h("iframe", {src: url, ref: el => this.iframe = el, onLoad: this.onIframeLoad.bind(this)}))
    ];
  }
};
__decorate([
  Prop()
], AppPreview.prototype, "demoUrl", void 0);
__decorate([
  Prop()
], AppPreview.prototype, "demoMode", void 0);
__decorate([
  Prop()
], AppPreview.prototype, "cssText", void 0);
__decorate([
  Watch('cssText')
], AppPreview.prototype, "onCssTextChange", null);
AppPreview = __decorate([
  Component({
    tag: 'app-preview',
    styleUrl: 'app-preview.css',
    shadow: true
  })
], AppPreview);
export {AppPreview};
