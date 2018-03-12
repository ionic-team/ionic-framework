var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import {Component, Event, Prop} from '@stencil/core';

let DemoSelection = class DemoSelection {
  onChangeUrl (ev) {
    this.demoUrlChange.emit(ev.currentTarget.value);
  }

  onChangeMode (ev) {
    this.demoModeChange.emit(ev.currentTarget.value);
  }

  render () {
    return [
      h("div", null,
        h("select", {onChange: this.onChangeUrl.bind(this)}, this.demoData.map(d => h("option", {
          value: d.url,
          selected: d.url === this.demoUrl
        }, d.name))),
        h("select", {onChange: this.onChangeMode.bind(this)},
          h("option", {value: 'md', selected: 'md' === this.demoMode}, "md"),
          h("option", {value: 'ios', selected: 'ios' === this.demoMode}, "ios")))
    ];
  }
};
__decorate([
  Prop()
], DemoSelection.prototype, "demoData", void 0);
__decorate([
  Prop()
], DemoSelection.prototype, "demoUrl", void 0);
__decorate([
  Prop()
], DemoSelection.prototype, "demoMode", void 0);
__decorate([
  Event()
], DemoSelection.prototype, "demoUrlChange", void 0);
__decorate([
  Event()
], DemoSelection.prototype, "demoModeChange", void 0);
DemoSelection = __decorate([
  Component({
    tag: 'demo-selection',
    styleUrl: 'demo-selection.css',
    shadow: true
  })
], DemoSelection);
export {DemoSelection};
