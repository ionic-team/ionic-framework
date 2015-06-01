import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs} from './tabs';


@Directive({
  selector: '.tab-button',
  properties: ['tab'],
  hostProperties: {
    'btnId': 'attr.id',
    'panelId': 'attr.aria-controls',
    'tab.isSelected': 'attr.aria-selected'
  },
  hostAttributes: {
    'role': 'tab'
  },
  hostListeners: {
    '^click': 'onClick($event)'
  },
  lifecycle: [onInit]
})
export class TabButton {
  constructor(@Parent() tabs: Tabs) {
    this.tabs = tabs;
  }

  onInit() {
    this.btnId = 'tab-button-' + this.tab.id;
    this.panelId = 'tab-panel-' + this.tab.id;
  }

  onClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.tabs.selectTab(this.tab);
  }
}
